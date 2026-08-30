import { expect, test, describe } from 'vitest';
import { execute, loadCandidateProfileTool } from '../lib/ai/tools/load-candidate-profile';

describe('loadCandidateProfileTool', () => {
  test('reads the real candidate-profile.json', async () => {
    const result = await execute();
    expect(result.targetRole).toBe('Junior Full-Stack Software Engineer');
    expect(result.experienceLevel).toBe('Junior');
    expect(result.skills).toEqual([
      'TypeScript',
      'React',
      'Next.js',
      'Git',
      'REST APIs'
    ]);
    expect(result.projects[0].name).toBe('Hit.AI');
  });

  test('tool definition has correct AI SDK shape', () => {
    expect(loadCandidateProfileTool).toHaveProperty('execute');
    expect(loadCandidateProfileTool).toHaveProperty('description');
  });
});
