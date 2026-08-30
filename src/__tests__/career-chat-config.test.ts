import { getCareerAIProvider } from '../lib/ai/career-chat-config';
import { describe, it, expect, beforeEach, afterAll, vi } from 'vitest';

describe('getCareerAIProvider', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('selects groq when GROQ_API_KEY is present', () => {
    process.env.GROQ_API_KEY = 'test-groq-key';
    const provider = getCareerAIProvider();
    expect(provider).toEqual({ type: 'groq', model: 'openai/gpt-oss-120b' });
  });

  it('selects groq when BOTH GROQ_API_KEY and ANTHROPIC_API_KEY are present (Groq wins)', () => {
    process.env.GROQ_API_KEY = 'test-groq-key';
    process.env.ANTHROPIC_API_KEY = 'test-anthropic-key';
    const provider = getCareerAIProvider();
    expect(provider.type).toBe('groq');
  });

  it('uses GROQ_MODEL override if provided', () => {
    process.env.GROQ_API_KEY = 'test-groq-key';
    process.env.GROQ_MODEL = 'custom-groq-model';
    const provider = getCareerAIProvider();
    expect(provider).toEqual({ type: 'groq', model: 'custom-groq-model' });
  });

  it('selects anthropic when only ANTHROPIC_API_KEY is present', () => {
    process.env.ANTHROPIC_API_KEY = 'test-anthropic-key';
    const provider = getCareerAIProvider();
    expect(provider.type).toBe('anthropic');
  });

  it('selects demo when neither key is present', () => {
    delete process.env.GROQ_API_KEY;
    delete process.env.ANTHROPIC_API_KEY;
    const provider = getCareerAIProvider();
    expect(provider.type).toBe('demo');
  });
});
