import { describe, test, expect } from 'vitest';
import type { UIMessage, TextUIPart } from 'ai';
import { getTextFromUIMessage, extractJobDescriptionRequest } from '../app/api/chat/route';

describe('Route Message Extraction', () => {
  test('handles current AI SDK text-part message shape', () => {
    const message: UIMessage = {
      id: 'msg-1',
      role: 'user',
      parts: [
        { type: 'text', text: 'Hello world' } as TextUIPart
      ]
    };
    expect(getTextFromUIMessage(message)).toBe('Hello world');
  });

  test('multi-line inspect request is detected and extracted excluding the prefix', () => {
    const message: UIMessage = {
      id: 'msg-2',
      role: 'user',
      parts: [
        { type: 'text', text: 'Inspect this job posting:\nJunior Frontend Developer\nReact' } as TextUIPart
      ]
    };
    const extracted = extractJobDescriptionRequest(message);
    expect(extracted).toBe('Junior Frontend Developer\nReact');
  });

  test('[[tool-error]] inspect request is detected', () => {
    const message: UIMessage = {
      id: 'msg-3',
      role: 'user',
      parts: [
        { type: 'text', text: 'Inspect this job posting: [[tool-error]]' } as TextUIPart
      ]
    };
    const extracted = extractJobDescriptionRequest(message);
    expect(extracted).toBe('[[tool-error]]');
  });

  test('ordinary career chat is NOT treated as a tool request', () => {
    const message: UIMessage = {
      id: 'msg-4',
      role: 'user',
      parts: [
        { type: 'text', text: 'Help me improve my interview preparation.' } as TextUIPart
      ]
    };
    const extracted = extractJobDescriptionRequest(message);
    expect(extracted).toBeNull();
  });

  test('robust matching for leading/trailing whitespace and capitalization', () => {
    const message: UIMessage = {
      id: 'msg-5',
      role: 'user',
      parts: [
        { type: 'text', text: '   INSPECT THIS JOB POSTING:   \n\nSoftware Engineer\n  ' } as TextUIPart
      ]
    };
    const extracted = extractJobDescriptionRequest(message);
    expect(extracted).toBe('Software Engineer');
  });
});
