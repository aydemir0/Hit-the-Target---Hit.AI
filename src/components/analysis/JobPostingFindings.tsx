import React from 'react';

type FindingsResult = {
  seniority: 'Intern' | 'Junior' | 'Mid' | 'Senior' | 'Unknown';
  technologies: string[];
  wordCount: number;
  findings: Array<{ label: string; evidence: string }>;
};

export default function JobPostingFindings({ result }: { result: FindingsResult }) {
  const hasNoResults = result.seniority === 'Unknown' && result.technologies.length === 0;

  if (hasNoResults) {
    return (
      <div className="flex flex-col gap-3 p-4 border border-border rounded-lg bg-card text-card-foreground shadow-sm">
        <h3 className="text-sm font-semibold">No clear technical signals found</h3>
        <p className="text-sm text-muted-foreground">
          Try pasting a more detailed job description with the responsibilities and requirements sections.
        </p>
        <button
          onClick={() => {
            const input = document.getElementById('chat-input') as HTMLTextAreaElement;
            if (input) {
              input.value = "Inspect this job posting:\nWe are hiring a Senior React Developer with 5+ years of experience in TypeScript and AWS.";
              // trigger React onChange
              const event = new Event('input', { bubbles: true });
              input.dispatchEvent(event);
              input.focus();
            }
          }}
          className="self-start text-xs font-medium bg-secondary text-secondary-foreground px-3 py-1.5 rounded-md hover:bg-secondary/80 transition-colors"
        >
          Insert detailed example
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 border border-border rounded-lg bg-card text-card-foreground shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Job Posting Inspection</h3>
        <div className="flex gap-2">
          {result.seniority !== 'Unknown' && (
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary border border-primary/20">
              {result.seniority}
            </span>
          )}
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-secondary/10 text-secondary-foreground border border-secondary/20">
            {result.wordCount} words
          </span>
        </div>
      </div>

      {result.technologies.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Technologies Found</h4>
          <div className="flex flex-wrap gap-2">
            {result.technologies.map((tech) => (
              <span key={tech} className="px-2 py-1 text-xs bg-muted rounded-md border border-border">
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {result.findings.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-2">Findings</h4>
          <ul className="space-y-2">
            {result.findings.map((f, i) => (
              <li key={i} className="text-sm">
                <strong className="block font-medium">{f.label}</strong>
                <span className="text-muted-foreground">{f.evidence}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
