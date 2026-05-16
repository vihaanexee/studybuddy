import Anthropic from '@anthropic-ai/sdk';
import type { AIProvider, ChatMessage } from './provider.js';
import { env } from '../config.js';
import { logger } from '../utils/logger.js';

export class AnthropicProvider implements AIProvider {
  private client: Anthropic;

  constructor() {
    this.client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY ?? '' });
  }

  async *streamChat(
    messages: ChatMessage[],
    systemPrompt: string,
    options: { maxTokens?: number; temperature?: number } = {},
  ): AsyncIterable<string> {
    // Filter out system messages — Anthropic uses a separate system param
    const anthropicMessages = messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));

    logger.debug(
      { messageCount: anthropicMessages.length },
      'Starting Anthropic stream',
    );

    const stream = this.client.messages.stream({
      model: 'claude-sonnet-4-20250514',
      max_tokens: options.maxTokens ?? 2048,
      temperature: options.temperature ?? 0.7,
      system: systemPrompt,
      messages: anthropicMessages,
    });

    for await (const event of stream) {
      if (
        event.type === 'content_block_delta' &&
        event.delta.type === 'text_delta'
      ) {
        yield event.delta.text;
      }
    }
  }
}
