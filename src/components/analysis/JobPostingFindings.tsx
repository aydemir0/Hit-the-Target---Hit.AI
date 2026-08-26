import React from 'react';

type FindingsResult = {
  seniority: 'Intern' | 'Junior' | 'Mid' | 'Senior' | 'Unknown';
  technologies: string[];
  wordCount: number;
  findings: Array<{ label: string; evidence: string }>;
};

export default function JobPostingFindings({ result }: { result: FindingsResult }) {
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
