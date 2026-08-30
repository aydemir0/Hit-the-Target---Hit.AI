import { z } from 'zod';
import { tool } from 'ai';
import { promises as fs } from 'fs';
import path from 'path';

export async function execute() {
  const filePath = path.join(process.cwd(), 'data', 'candidate-profile.json');
  const fileContents = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(fileContents);
}

export const loadCandidateProfileTool = tool({
  description: 'Loads the candidate profile data from the server. Requires no arguments.',
  inputSchema: z.object({}),
  execute
});
