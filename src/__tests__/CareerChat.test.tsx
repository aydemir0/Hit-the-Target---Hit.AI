import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import React from 'react';
import CareerChat from '../components/analysis/CareerChat';
import { UIMessage } from 'ai';

const mockUseChat = {
  messages: [] as UIMessage[],
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

describe('CareerChat Resilience (FE-09)', () => {
  afterEach(cleanup);
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseChat.messages = [];
    mockUseChat.input = '';
    mockUseChat.error = undefined;
    mockUseChat.status = 'ready';
  });

  test('CHAT 1: text message rendering', () => {
    mockUseChat.messages = [
      { id: '1', role: 'user', parts: [{ type: 'text', text: 'Hello' }] },
      { id: '2', role: 'assistant', parts: [{ type: 'text', text: 'Hi there!' }] }
    ];
    render(<CareerChat isDemoMode={false} />);

    expect(screen.getByText('You')).toBeInTheDocument();
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('Hit.AI Assistant')).toBeInTheDocument();
    expect(screen.getByText('Hi there!')).toBeInTheDocument();
  });

  test('CHAT 2: supported tool part', () => {
    mockUseChat.messages = [
      {
        id: '1',
        role: 'assistant',
        parts: [{
          type: 'tool-inspectJobPosting',
          state: 'input-available',
          toolCallId: '123',
          input: { jobDescription: 'Junior React' }
        }]
      }
    ];
    render(<CareerChat isDemoMode={false} />);
    expect(screen.getByText(/Inspecting requirements...|Junior React/i)).toBeInTheDocument();
  });

  test('CHAT 3: pending/submitted', () => {
    mockUseChat.status = 'submitted';
    render(<CareerChat isDemoMode={false} />);

    expect(screen.getByText('Assistant is thinking...')).toBeInTheDocument();
    const input = screen.getByLabelText(/Type your message/i) as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });

  test('CHAT 4: streaming with text', () => {
    mockUseChat.status = 'streaming';
    mockUseChat.messages = [
      { id: '1', role: 'assistant', parts: [{ type: 'text', text: 'Partial response...' }] }
    ];
    render(<CareerChat isDemoMode={false} />);

    expect(screen.getByText('Partial response...')).toBeInTheDocument();
    expect(screen.queryByText('Assistant is thinking...')).not.toBeInTheDocument();
  });

  test('CHAT 5: streaming without text', () => {
    mockUseChat.status = 'streaming';
    mockUseChat.messages = [
      { id: '1', role: 'assistant', parts: [] }
    ];
    render(<CareerChat isDemoMode={false} />);

    expect(screen.getByText('Assistant is thinking...')).toBeInTheDocument();
  });

  test('CHAT 6: error', () => {
    mockUseChat.error = new Error('Test error');
    render(<CareerChat isDemoMode={false} />);

    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert.textContent).toContain('The response was interrupted');

    const retryBtn = screen.getByRole('button', { name: /Retry response/i });
    expect(retryBtn).toBeInTheDocument();

    fireEvent.click(retryBtn);
    expect(mockUseChat.regenerate).toHaveBeenCalled();
  });

  test('CHAT INPUT INTERACTION', () => {
    render(<CareerChat isDemoMode={false} />);

    const input = screen.getByLabelText(/Type your message/i);
    fireEvent.change(input, { target: { value: 'My career goals' } });

    const form = input.closest('form');
    fireEvent.submit(form!);
    expect(mockUseChat.sendMessage).toHaveBeenCalledWith({
      role: 'user',
      parts: [{ type: 'text', text: 'My career goals' }]
    });
  });
});
