import React from 'react';
import JobPostingFindings from './JobPostingFindings';

import type { ToolUIPart, InferUITools } from 'ai';
import { inspectJobPostingTool } from '@/lib/ai/tools/inspect-job-posting';
import { z } from 'zod';

export type InspectJobPostingPart = ToolUIPart<InferUITools<{
  inspectJobPosting: typeof inspectJobPostingTool;
}>>;

const outputSchema = z.object({
  seniority: z.enum(['Intern', 'Junior', 'Mid', 'Senior', 'Unknown']),
  technologies: z.array(z.string()),
  wordCount: z.number(),
  findings: z.array(z.object({
    label: z.string(),
    evidence: z.string()
  }))
});

export default function JobPostingToolPart({ toolInvocation }: { toolInvocation: InspectJobPostingPart }) {
  const { state, input } = toolInvocation;

  if (state === 'input-streaming') {
    const preview = input?.jobDescription ? input.jobDescription.substring(0, 50) + '...' : 'Preparing job-posting inspection';
    
    return (
      <div className="flex flex-col p-4 border border-border rounded-lg bg-background shadow-sm animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <span className="text-sm font-medium text-muted-foreground">{preview}</span>
        </div>
      </div>
    );
  }

  if (state === 'input-available') {
    const jobDesc = input.jobDescription;
    const charCount = jobDesc ? jobDesc.length : 0;
    
    return (
      <div className="flex flex-col p-4 border border-border rounded-lg bg-card text-card-foreground shadow-sm transition-all duration-200">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          <span className="text-sm font-medium">Inspecting requirements...</span>
          <span className="text-xs text-muted-foreground ml-auto">{charCount} chars accepted</span>
        </div>
      </div>
    );
  }

  if (state === 'output-error') {
    const errorMessage = toolInvocation.errorText || 'An unknown error occurred';
    
    return (
      <div role="alert" className="flex flex-col p-4 border border-destructive/50 rounded-lg bg-destructive/10 text-destructive shadow-sm transition-all duration-200">
        <h3 className="text-sm font-semibold mb-1">Could not inspect this job posting</h3>
        <p className="text-xs opacity-90">{errorMessage}</p>
        <div className="mt-2 text-xs font-medium">
          Please check your input or try again later.
        </div>
      </div>
    );
  }

  if (state === 'output-available') {
    const parsed = outputSchema.safeParse(toolInvocation.output);
    if (!parsed.success) {
      return (
        <div role="alert" className="flex flex-col p-4 border border-destructive/50 rounded-lg bg-destructive/10 text-destructive shadow-sm transition-all duration-200">
          <h3 className="text-sm font-semibold mb-1">Could not display tool result</h3>
          <p className="text-xs opacity-90">The inspection completed but returned unexpected data format.</p>
        </div>
      );
    }

    return (
      <div className="transition-all duration-200">
        <JobPostingFindings result={parsed.data} />
      </div>
    );
  }

  return null;
}
