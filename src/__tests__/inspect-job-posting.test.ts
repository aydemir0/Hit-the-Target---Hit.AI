import { expect, test, describe } from 'vitest';
import { execute } from '../lib/ai/tools/inspect-job-posting';

describe('inspectJobPostingTool', () => {
  test('recognizes technologies actually present', async () => {
    const result = await execute({ jobDescription: 'We are looking for a developer who knows React, Node.js, and Python.' });
    expect(result.technologies).toEqual(expect.arrayContaining(['React', 'Node.js', 'Python']));
  });

  test('does not return absent technologies', async () => {
    const result = await execute({ jobDescription: 'We need someone for Java and Ruby.' });
    expect(result.technologies).not.toContain('React');
    expect(result.technologies.length).toBe(0);
  });

  test('seniority detection', async () => {
    let result = await execute({ jobDescription: 'Looking for a Senior Developer.' });
    expect(result.seniority).toBe('Senior');

    result = await execute({ jobDescription: 'Junior entry-level position.' });
    expect(result.seniority).toBe('Junior');
    
    result = await execute({ jobDescription: 'A mid-level engineer.' });
    expect(result.seniority).toBe('Mid');
  });

  test('[[tool-error]] controlled failure', async () => {
    await expect(execute({ jobDescription: 'Please see this posting: [[tool-error]]' }))
      .rejects.toThrow('Job posting inspection failed in the intentional error-state demo.');
  });
});
