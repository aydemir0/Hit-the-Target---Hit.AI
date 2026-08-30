
import { z } from 'zod';

const technologiesList = [
  'TypeScript', 'JavaScript', 'React', 'Next.js', 'Node.js', 
  'Python', 'C#', '.NET', 'SQL', 'PostgreSQL', 
  'Git', 'Docker', 'AWS', 'REST', 'GraphQL'
];

import { tool } from 'ai';

const inputSchema = z.object({
  jobDescription: z.string()
    .trim()
    .min(10)
    .max(20000)
    .describe('The raw text of the job posting to inspect.')
});

export async function execute({ jobDescription }: z.infer<typeof inputSchema>) {
  if (jobDescription.includes('[[tool-error]]')) {
    throw new Error('Job posting inspection failed in the intentional error-state demo.');
  }

  const wordCount = jobDescription.split(/\s+/).filter(Boolean).length;
  
  const technologies: string[] = [];
  const lowerDesc = jobDescription.toLowerCase();
  
  // Check technologies
  for (const tech of technologiesList) {
    if (lowerDesc.includes(tech.toLowerCase())) {
      technologies.push(tech);
    }
  }

  // Seniority detection
  let seniority: 'Intern' | 'Junior' | 'Mid' | 'Senior' | 'Unknown' = 'Unknown';
  if (lowerDesc.includes('intern') || lowerDesc.includes('internship')) {
    seniority = 'Intern';
  } else if (lowerDesc.includes('junior') || lowerDesc.includes('entry-level') || lowerDesc.includes('entry level')) {
    seniority = 'Junior';
  } else if (lowerDesc.includes('mid-level') || lowerDesc.includes('mid level')) {
    seniority = 'Mid';
  } else if (lowerDesc.includes('senior') || lowerDesc.includes('lead')) {
    seniority = 'Senior';
  }

  // Findings
  const findings: Array<{ label: string; evidence: string }> = [];
  
  if (technologies.length > 0) {
    findings.push({
      label: 'Core Technologies',
      evidence: `Mentions ${technologies.length} key technologies from our known vocabulary.`
    });
  }

  if (seniority !== 'Unknown') {
    findings.push({
      label: 'Explicit Seniority',
      evidence: `The text explicitly mentions signals indicating ${seniority} level.`
    });
  }

  return {
    seniority,
    technologies,
    wordCount,
    findings
  };
}

export const inspectJobPostingTool = tool({
  description: 'Inspect user-supplied job posting text and return deterministic structured signals for generative UI.',
  inputSchema,
  execute
});
