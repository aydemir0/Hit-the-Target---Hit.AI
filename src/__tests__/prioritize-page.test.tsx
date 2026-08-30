import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { expect, test, describe, vi, afterEach } from 'vitest';
import PrioritizePage from '../app/prioritize/page';
import * as actions from '../app/prioritize/actions';

vi.mock('../app/prioritize/actions', () => ({
  prioritizeJobPosting: vi.fn()
}));

describe('PrioritizePage UI', () => {
  afterEach(() => cleanup());

  test('textarea and Analyze opportunity button render', () => {
    render(<PrioritizePage />);
    expect(screen.getByText('Job Application Prioritizer')).toBeDefined();
    expect(screen.getByPlaceholderText('Paste job posting here...')).toBeDefined();
    expect(screen.getByRole('button', { name: 'Analyze opportunity' })).toBeDefined();
  });

  test('empty submit prevented', async () => {
    render(<PrioritizePage />);
    const button = screen.getByRole('button', { name: 'Analyze opportunity' });
    expect((button as HTMLButtonElement).disabled).toBe(true);
  });

  test('loading state and result card render', async () => {
    const mockResult = {
      recommendation: 'Apply' as const,
      reason: 'Perfect match',
      confirmedMatches: ['React'],
      gapsOrUnknowns: ['Docker'],
      nextActions: ['Update resume']
    };
    
    vi.mocked(actions.prioritizeJobPosting).mockResolvedValueOnce(mockResult);

    render(<PrioritizePage />);
    const textarea = screen.getByPlaceholderText('Paste job posting here...');
    const button = screen.getByRole('button', { name: 'Analyze opportunity' });

    fireEvent.change(textarea, { target: { value: 'Valid job posting' } });
    expect((button as HTMLButtonElement).disabled).toBe(false);

    fireEvent.click(button);
    expect(screen.getByText('Analyzing...')).toBeDefined();

    await waitFor(() => {
      expect(screen.getByText('Recommendation: Apply')).toBeDefined();
      expect(screen.getByText('Perfect match')).toBeDefined();
      expect(screen.getByText('React')).toBeDefined();
      expect(screen.getByText('Docker')).toBeDefined();
      expect(screen.getByText('Update resume')).toBeDefined();
    });
  });

  test('error state offers retry', async () => {
    vi.mocked(actions.prioritizeJobPosting).mockRejectedValueOnce(new Error('API failed'));

    render(<PrioritizePage />);
    const textarea = screen.getByPlaceholderText('Paste job posting here...');
    const button = screen.getByRole('button', { name: 'Analyze opportunity' });

    fireEvent.change(textarea, { target: { value: 'Valid job posting' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('API failed')).toBeDefined();
      expect(screen.getByRole('button', { name: 'Retry' })).toBeDefined();
    });
  });
});
