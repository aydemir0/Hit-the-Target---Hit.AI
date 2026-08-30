import { describe, test, expect, vi } from 'vitest';
import { POST } from '../app/api/chat/route';

// We need to bypass environment variable logic.
// We'll set it so isDemoMode triggers.
vi.stubEnv('ANTHROPIC_API_KEY', '');

describe('Sabotage Route Behavior', () => {
  test('rate-limit sabotage returns 429 one-shot', async () => {
    const req = new Request('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [{ role: 'user', parts: [{ type: 'text', text: 'Hello' }] }],
        sabotage: 'rate-limit'
      })
    });

    const res = await POST(req);
    expect(res.status).toBe(429);
    
    const body = await res.json();
    expect(body.error).toBe('Too many requests');
  });

  test('regenerate (no sabotage metadata) processes normally', async () => {
    const req = new Request('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [{ role: 'user', parts: [{ type: 'text', text: 'Hello' }] }]
      })
    });

    const res = await POST(req);
    // Not a 429
    expect(res.status).toBe(200);
    // Returns a stream
    expect(res.headers.get('content-type')).toContain('text/event-stream');
  });
});
