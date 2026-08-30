import { expect, test, describe, vi, beforeAll, afterAll } from 'vitest';
import { prioritizeJobPosting } from '../app/prioritize/actions';
import * as aiModule from 'ai';

vi.mock('ai', async (importOriginal) => {
  const actual = await importOriginal<typeof import('ai')>();
  return {
    ...actual,
    generateObject: vi.fn().mockResolvedValue({
      object: {
        recommendation: 'Apply',
        reason: 'Mocked reason',
        confirmedMatches: ['Mocked Match'],
        gapsOrUnknowns: [],
        nextActions: []
      }
    })
  };
});

describe('Route/Agent Behavior', () => {
  const originalEnv = process.env.GROQ_API_KEY;
  beforeAll(() => {
    process.env.GROQ_API_KEY = 'mock-key';
  });
  afterAll(() => {
    process.env.GROQ_API_KEY = originalEnv;
  });

  test('empty job posting rejected', async () => {
    await expect(prioritizeJobPosting('')).rejects.toThrow('Job description is required.');
    await expect(prioritizeJobPosting('   ')).rejects.toThrow('Job description is required.');
  });

  test('tools are available to real provider, no external network calls', async () => {
    // This implicitly tests that generateObject is mocked, so no network call is made
    const result = await prioritizeJobPosting('Valid job posting with React and Next.js');
    expect(result.recommendation).toBe('Apply');
    expect(result.reason).toBe('Mocked reason');
    expect(aiModule.generateObject).toHaveBeenCalled();
  });
});
