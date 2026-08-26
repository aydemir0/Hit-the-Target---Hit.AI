import React from 'react';
import { render, screen } from '@testing-library/react';
import { expect, test, describe } from 'vitest';
import JobPostingToolPart, { InspectJobPostingPart } from '../components/analysis/JobPostingToolPart';

describe('JobPostingToolPart', () => {
  test('input-streaming renders loading treatment', () => {
    const invocation: InspectJobPostingPart = {
      type: 'tool-inspectJobPosting',
      state: 'input-streaming',
      toolCallId: '123',
      input: { jobDescription: 'Junior React role' }
    };
    
    const { container } = render(<JobPostingToolPart toolInvocation={invocation} />);
    expect(screen.getByText(/Junior React role/)).toBeTruthy();
    // checking for the animate-pulse loading skeleton wrapper
    expect(container.firstChild).toHaveProperty('className');
    expect((container.firstChild as HTMLElement).className).toContain('animate-pulse');
  });

  test('input-available renders accepted/processing treatment', () => {
    const invocation: InspectJobPostingPart = {
      type: 'tool-inspectJobPosting',
      state: 'input-available',
      toolCallId: '123',
      input: { jobDescription: 'Junior React role' }
    };
    
    render(<JobPostingToolPart toolInvocation={invocation} />);
    expect(screen.getByText('Inspecting requirements...')).toBeTruthy();
    expect(screen.getByText('17 chars accepted')).toBeTruthy();
  });

  test('output-available renders JobPostingFindings component', () => {
    const output = {
      seniority: 'Junior' as const,
      technologies: ['React'],
      wordCount: 3,
      findings: [{ label: 'Tech', evidence: 'React' }]
    };
    const invocation: InspectJobPostingPart = {
      type: 'tool-inspectJobPosting',
      state: 'output-available',
      toolCallId: '123',
      input: { jobDescription: 'Junior React role' },
      output
    };
    
    render(<JobPostingToolPart toolInvocation={invocation} />);
    expect(screen.getByText('Job Posting Inspection')).toBeTruthy();
    expect(screen.getByText('Junior')).toBeTruthy();
    expect(screen.getAllByText('React').length).toBeGreaterThan(0);
    expect(screen.getByText('3 words')).toBeTruthy();
  });

  test('output-error renders role=alert error treatment', () => {
    const invocation: InspectJobPostingPart = {
      type: 'tool-inspectJobPosting',
      state: 'output-error',
      toolCallId: '123',
      input: { jobDescription: '[[tool-error]]' },
      errorText: 'Job posting inspection failed in the intentional error-state demo.'
    };
    
    render(<JobPostingToolPart toolInvocation={invocation} />);
    expect(screen.getByRole('alert')).toBeTruthy();
    expect(screen.getByText('Could not inspect this job posting')).toBeTruthy();
    expect(screen.getByText(/intentional error-state demo/)).toBeTruthy();
  });
});
