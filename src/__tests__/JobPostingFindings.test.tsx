import { describe, test, expect, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import JobPostingFindings from '../components/analysis/JobPostingFindings';

describe('JobPostingFindings', () => {
  afterEach(cleanup);
  test('no-results JobPostingFindings state', () => {
    // Setup the mock input element to test the action
    document.body.innerHTML = '<textarea id="chat-input"></textarea>';
    
    render(<JobPostingFindings result={{ seniority: 'Unknown', technologies: [], wordCount: 40, findings: [] }} />);
    
    expect(screen.getByText('No clear technical signals found')).toBeDefined();
    
    const button = screen.getByRole('button', { name: /Insert detailed example/i });
    expect(button).toBeDefined();
    
    fireEvent.click(button);
    const input = document.getElementById('chat-input') as HTMLTextAreaElement;
    expect(input.value).toContain('Senior React Developer');
  });

  test('renders normally when there are results', () => {
    render(
      <JobPostingFindings 
        result={{ 
          seniority: 'Senior', 
          technologies: ['React'], 
          wordCount: 150, 
          findings: [{ label: 'Tech', evidence: 'Found React' }] 
        }} 
      />
    );
    
    expect(screen.getByText('Job Posting Inspection')).toBeDefined();
    expect(screen.getByText('Senior')).toBeDefined();
    expect(screen.getByText('React')).toBeDefined();
  });
});
