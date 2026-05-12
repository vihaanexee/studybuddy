export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIProvider {
  /**
   * Stream chat completion tokens as an async iterable.
   * Each yielded string is a text chunk/token.
   */
  streamChat(
    messages: ChatMessage[],
    systemPrompt: string,
    options?: { maxTokens?: number; temperature?: number },
  ): AsyncIterable<string>;
}
