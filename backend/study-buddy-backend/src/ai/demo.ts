import type { AIProvider, ChatMessage } from './provider.js';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const KNOWLEDGE_SNIPPETS: Array<{ keywords: string[]; response: string }> = [
  {
    keywords: ['photosynthesis'],
    response:
      'Photosynthesis is how plants turn light energy into stored chemical energy. Chlorophyll captures sunlight, water comes from the roots, carbon dioxide comes from the air, and the plant produces glucose plus oxygen. A simple way to remember it is: light helps plants turn air and water into food.',
  },
  {
    keywords: ['derivative', 'differentiation'],
    response:
      'A derivative tells you the instantaneous rate of change of a function. On a graph, it is the slope of the tangent line at a point. For example, if position changes over time, the derivative of position is velocity.',
  },
  {
    keywords: ['fraction', 'fractions'],
    response:
      'A fraction represents part of a whole. The top number tells you how many parts you have, and the bottom number tells you how many equal parts the whole was split into. To compare fractions, it often helps to use a common denominator.',
  },
  {
    keywords: ['recursion'],
    response:
      'Recursion is when a function solves a problem by calling itself on a smaller version of the same problem. Every recursive solution needs a base case, which stops the calls, and a recursive step, which makes the problem smaller.',
  },
  {
    keywords: ['newton', 'force', 'motion'],
    response:
      'Newton’s laws describe how objects move. The key idea is that forces change motion: more force means more acceleration, and more mass makes acceleration harder. The short formula to remember is F = m x a.',
  },
  {
    keywords: ['cell', 'cells'],
    response:
      'Cells are the basic units of life. The cell membrane controls what enters and leaves, the nucleus stores DNA, mitochondria release usable energy, and cytoplasm holds many of the cell’s working parts.',
  },
];

function lastUserMessage(messages: ChatMessage[]): string {
  return [...messages].reverse().find((message) => message.role === 'user')?.content.trim() ?? '';
}

function extractTopic(systemPrompt: string): string | null {
  const match = systemPrompt.match(/current study topic is: "([^"]+)"/i);
  return match?.[1] ?? null;
}

function findSnippet(text: string, topic: string | null): string | null {
  const searchText = `${text} ${topic ?? ''}`.toLowerCase();
  return KNOWLEDGE_SNIPPETS.find((item) =>
    item.keywords.some((keyword) => searchText.includes(keyword)),
  )?.response ?? null;
}

function wantsQuiz(text: string): boolean {
  return /\b(quiz|test me|practice|question|mcq)\b/i.test(text);
}

function wantsSteps(text: string): boolean {
  return /\b(step|solve|how do i|walk me through|explain)\b/i.test(text);
}

function buildResponse(messages: ChatMessage[], systemPrompt: string): string {
  const question = lastUserMessage(messages);
  const topic = extractTopic(systemPrompt);
  const snippet = findSnippet(question, topic);
  const subject = topic || 'this topic';

  if (!question) {
    return `Hi, I am ready. Tell me what you are studying and I will help you break it down clearly.`;
  }

  if (wantsQuiz(question)) {
    return `Great, let's do a quick check on **${subject}**.\n\n1. What is the main idea in your own words?\n2. Can you give one real example?\n3. What part still feels unclear?\n\nTry answering the first one, and I will guide you from there.`;
  }

  const intro = snippet
    ? snippet
    : `Let's tackle this carefully. The main idea behind **${subject}** is to identify the core concept first, then connect each detail back to that concept.`;

  const steps = wantsSteps(question)
    ? `\n\nA good way to work through it:\n\n1. **Name what you know.** Pull out the given facts or definitions.\n2. **Find the missing piece.** Ask what the question is really asking for.\n3. **Use one rule at a time.** Do not jump steps.\n4. **Check the result.** Make sure the answer matches the original question.`
    : '';

  return `${intro}${steps}\n\nFor your question, I would start by rewriting it in simpler words: "${question}". Once it is in plain language, the next move is much easier.\n\nWhat I want you to try next: tell me which part feels most confusing, and I will zoom in on that piece.`;
}

function chunkText(text: string): string[] {
  return text.match(/.{1,28}(\s|$)/g) ?? [text];
}

export class DemoProvider implements AIProvider {
  async *streamChat(
    messages: ChatMessage[],
    systemPrompt: string,
    _options: { maxTokens?: number; temperature?: number } = {},
  ): AsyncIterable<string> {
    const response = buildResponse(messages, systemPrompt);

    for (const chunk of chunkText(response)) {
      yield chunk;
      await delay(18);
    }
  }
}
