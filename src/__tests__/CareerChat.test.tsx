import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import React from 'react';
import CareerChat from '../components/analysis/CareerChat';

// Mock useChat to easily control state
const mockUseChat = {
  messages: [],
  input: '',
  handleInputChange: vi.fn(),
  handleSubmit: vi.fn((e) => e?.preventDefault()),
  error: undefined as undefined | Error,
  regenerate: vi.fn(),
  stop: vi.fn(),
  status: 'ready' as 'ready' | 'submitted' | 'streaming' | 'error',
  setInput: vi.fn(),
  sendMessage: vi.fn()
};

vi.mock('@ai-sdk/react', () => ({
  useChat: () => mockUseChat
}));

describe('CareerChat Resilience', () => {
  afterEach(cleanup);
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseChat.messages = [];
    mockUseChat.input = '';
    mockUseChat.error = undefined;
    mockUseChat.status = 'ready';
  });

  test('first-run empty state has useful next actions', () => {
    render(<CareerChat isDemoMode={true} />);
    expect(screen.getByText('Career Analysis Chat')).toBeDefined();
    expect(screen.getByRole('button', { name: /Inspect a job posting/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Ask for interview prep/i })).toBeDefined();
  });

  test('whitespace input does not submit', () => {
    mockUseChat.input = '   \n  ';
    const { getByRole } = render(<CareerChat isDemoMode={true} />);
    
    const sendButton = getByRole('button', { name: /Send message/i }) as HTMLButtonElement;
    expect(sendButton.disabled).toBe(true);

    const form = sendButton.closest('form');
    fireEvent.submit(form!);
    expect(mockUseChat.handleSubmit).not.toHaveBeenCalled();
  });

  test('chat error panel renders with role=alert and Retry response action exists', () => {
    mockUseChat.error = new Error('Test error');
    render(<CareerChat isDemoMode={true} />);
    
    const alert = screen.getByRole('alert');
    expect(alert).toBeDefined();
    expect(alert.textContent).toContain('The response was interrupted');
    
    const retryBtn = screen.getByRole('button', { name: /Retry response/i });
    expect(retryBtn).toBeDefined();
    
    fireEvent.click(retryBtn);
    expect(mockUseChat.regenerate).toHaveBeenCalled();
  });

  test('retry disabled while retry already running', () => {
    mockUseChat.error = new Error('Test error');
    mockUseChat.status = 'submitted';
    render(<CareerChat isDemoMode={true} />);
    
    const retryBtn = screen.getByRole('button', { name: /Retry response/i }) as HTMLButtonElement;
    expect(retryBtn.disabled).toBe(true);
  });

  test('slow/pending skeleton visible when waiting', () => {
    mockUseChat.status = 'submitted';
    render(<CareerChat isDemoMode={true} />);
    
    // Skeleton should be visible when thinking
    const thinkingIndicator = screen.getByText('Assistant is thinking...').parentElement?.parentElement;
    expect(thinkingIndicator?.innerHTML).toContain('animate-pulse');
  });

  test('demo buttons send correct payload and metadata', () => {
    render(<CareerChat isDemoMode={true} />);
    
    // 1. Mid-stream failure
    const midStreamBtn = screen.getByRole('button', { name: /Mid-stream failure/i });
    fireEvent.click(midStreamBtn);
    expect(mockUseChat.sendMessage).toHaveBeenCalledWith(
      { role: 'user', parts: [{ type: 'text', text: 'Give me a short career analysis demo.' }] },
      { body: { sabotage: 'mid-stream' } }
    );
    mockUseChat.sendMessage.mockClear();

    // 2. Rate limit
    const rateLimitBtn = screen.getByRole('button', { name: /Rate limit/i });
    fireEvent.click(rateLimitBtn);
    expect(mockUseChat.sendMessage).toHaveBeenCalledWith(
      { role: 'user', parts: [{ type: 'text', text: 'Give me a short career analysis demo.' }] },
      { body: { sabotage: 'rate-limit' } }
    );
    mockUseChat.sendMessage.mockClear();

    // 3. Slow response
    const slowResponseBtn = screen.getByRole('button', { name: /Slow response/i });
    fireEvent.click(slowResponseBtn);
    expect(mockUseChat.sendMessage).toHaveBeenCalledWith(
      { role: 'user', parts: [{ type: 'text', text: 'Give me a short career analysis demo.' }] },
      { body: { sabotage: 'slow-response' } }
    );
    mockUseChat.sendMessage.mockClear();

    // 4. Inspect job posting (NO sabotage metadata, text contains tool prefix)
    const toolDemoBtn = screen.getByRole('button', { name: /Inspect a job posting/i });
    fireEvent.click(toolDemoBtn);
    const lastCall = mockUseChat.sendMessage.mock.calls[0];
    expect(lastCall[0].parts[0].text).toContain('Inspect this job posting:');
    expect(lastCall[1]).toBeUndefined(); // no metadata
  });
});
