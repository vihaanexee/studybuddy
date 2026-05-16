import { env } from '../config.js';
import { logger } from '../utils/logger.js';
import type { AIProvider } from './provider.js';
import { AnthropicProvider } from './anthropic.js';
import { DemoProvider } from './demo.js';
import { MiniMaxProvider } from './minimax.js';
import { OpenRouterProvider } from './openrouter.js';

let provider: AIProvider | null = null;

function hasAnthropicKey(): boolean {
  const key = env.ANTHROPIC_API_KEY?.trim();
  return Boolean(key && !key.startsWith('sk-ant-xxxxxxxx'));
}

export function getAIProvider(): AIProvider {
  if (provider) return provider;

  if (env.AI_PROVIDER === 'anthropic') {
    if (!hasAnthropicKey()) {
      throw new Error('AI_PROVIDER is set to anthropic, but ANTHROPIC_API_KEY is missing.');
    }

    provider = new AnthropicProvider();
    return provider;
  }

  if (env.AI_PROVIDER === 'minimax') {
    provider = new MiniMaxProvider();
    return provider;
  }

  if (env.AI_PROVIDER === 'openrouter') {
    provider = new OpenRouterProvider();
    return provider;
  }

  if (env.AI_PROVIDER === 'auto' && hasAnthropicKey()) {
    provider = new AnthropicProvider();
    return provider;
  }

  logger.warn(
    { aiProvider: env.AI_PROVIDER },
    'Using demo AI provider because no Anthropic API key is configured',
  );
  provider = new DemoProvider();
  return provider;
}
