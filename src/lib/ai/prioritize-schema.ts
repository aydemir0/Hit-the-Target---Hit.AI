import { z } from 'zod';

export const prioritizationResultSchema = z.object({
  recommendation: z.enum(['Apply', 'Maybe', 'Skip']),
  reason: z.string(),
  confirmedMatches: z.array(z.string()),
  gapsOrUnknowns: z.array(z.string()),
  nextActions: z.array(z.string()).max(3)
});

export type PrioritizationResult = z.infer<typeof prioritizationResultSchema>;
