import type { UIMessage } from 'ai';

export const MAX_MESSAGES = 30;
export const MAX_MESSAGE_CHARS = 12000;
export const MAX_TOTAL_CHARS = 30000;

interface RateLimitStore {
  [ip: string]: {
    count: number;
    resetTime: number;
  };
}

const rateLimitStore: RateLimitStore = {};
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 60 seconds
const MAX_REQUESTS_PER_WINDOW = 10;

export function checkInputCaps(messages: UIMessage[] | undefined): string | null {
  if (!messages || !Array.isArray(messages)) {
    return 'Invalid request: messages array is required.';
  }

  if (messages.length > MAX_MESSAGES) {
    return `Request blocked: exceeded maximum of ${MAX_MESSAGES} messages.`;
  }

  let totalChars = 0;

  for (const message of messages) {
    if (Array.isArray(message.parts)) {
      for (const part of message.parts) {
        if (part.type === 'text') {
          const len = part.text.length;
          if (len > MAX_MESSAGE_CHARS) {
            return `Request blocked: a message exceeds the maximum of ${MAX_MESSAGE_CHARS} characters.`;
          }
          totalChars += len;
        }
      }
    }
  }

  if (totalChars > MAX_TOTAL_CHARS) {
    return `Request blocked: total content exceeds the maximum of ${MAX_TOTAL_CHARS} characters.`;
  }

  return null; // no error
}

export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitStore[ip];

  if (!record) {
    rateLimitStore[ip] = {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
    };
    return true; // allowed
  }

  if (now > record.resetTime) {
    // reset window
    rateLimitStore[ip] = {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
    };
    return true; // allowed
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return false; // blocked
  }

  record.count++;
  return true; // allowed
}

export function getClientIp(req: Request): string {
  return req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown-ip';
}
