import { env } from '../config.js';
import type { AIProvider, ChatMessage } from './provider.js';

interface OpenRouterStreamChunk {
  choices?: Array<{
    delta?: {
      content?: string;
    };
    message?: {
      content?: string;
    };
  }>;
  error?: {
    message?: string;
  };
}

function toOpenRouterMessages(messages: ChatMessage[], systemPrompt: string) {
  return [
    { role: 'system', content: systemPrompt },
    ...messages
      .filter((message) => message.role !== 'system')
      .map((message) => ({
        role: message.role,
        content: message.content,
      })),
  ];
}

export class OpenRouterProvider implements AIProvider {
  async *streamChat(
    messages: ChatMessage[],
    systemPrompt: string,
    options: { maxTokens?: number; temperature?: number } = {},
  ): AsyncIterable<string> {
    const apiKey = env.OPENROUTER_API_KEY?.trim();
    if (!apiKey) {
      throw new Error('OPENROUTER_API_KEY is required when AI_PROVIDER=openrouter.');
    }

    const response = await fetch(`${env.OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Study Buddy',
      },
      body: JSON.stringify({
        model: env.OPENROUTER_MODEL,
        messages: toOpenRouterMessages(messages, systemPrompt),
        stream: true,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens ?? 2048,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`OpenRouter request failed (${response.status}): ${body}`);
    }

    if (!response.body) {
      throw new Error('OpenRouter did not return a response body.');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const events = buffer.split('\n\n');
      buffer = events.pop() ?? '';

      for (const event of events) {
        for (const line of event.split('\n')) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) continue;

          const data = trimmed.slice('data:'.length).trim();
          if (!data || data === '[DONE]') continue;

          const chunk = JSON.parse(data) as OpenRouterStreamChunk;
          if (chunk.error?.message) throw new Error(chunk.error.message);

          const content =
            chunk.choices?.[0]?.delta?.content ?? chunk.choices?.[0]?.message?.content;
          if (content) yield content;
        }
      }
    }
  }
}
