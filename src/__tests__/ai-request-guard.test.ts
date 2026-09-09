import { describe, it, expect } from 'vitest';
import { checkInputCaps, checkRateLimit, getClientIp } from '@/lib/ai/ai-request-guard';
import type { UIMessage } from 'ai';

describe('ai-request-guard', () => {
  describe('checkInputCaps', () => {
    it('accepts a valid request', () => {
      const messages: UIMessage[] = [
        { role: 'user', id: '1', parts: [{ type: 'text', text: 'hello' }] }
      ];
      expect(checkInputCaps(messages)).toBeNull();
    });

    it('rejects missing messages array', () => {
      expect(checkInputCaps(undefined as unknown as UIMessage[])).toContain('messages array is required');
    });

    it('rejects too many messages', () => {
      const messages: UIMessage[] = Array.from({ length: 31 }).map((_, i) => ({
        role: 'user', id: String(i), parts: [{ type: 'text', text: 'test' }]
      }));
      expect(checkInputCaps(messages)).toContain('exceeded maximum');
    });

    it('rejects oversized single message text part', () => {
      const messages: UIMessage[] = [
        { role: 'user', id: '1', parts: [{ type: 'text', text: 'a'.repeat(12001) }] }
      ];
      expect(checkInputCaps(messages)).toContain('exceeds the maximum of 12000');
    });

    it('rejects oversized total payload', () => {
      const messages: UIMessage[] = Array.from({ length: 3 }).map((_, i) => ({
        role: 'user', id: String(i), parts: [{ type: 'text', text: 'a'.repeat(11000) }]
      }));
      expect(checkInputCaps(messages)).toContain('total content exceeds the maximum');
    });
  });

  describe('checkRateLimit', () => {
    it('allows requests within limit and blocks when exceeded', () => {
      const ip = '192.168.1.1';
      // First 10 requests should pass
      for (let i = 0; i < 10; i++) {
        expect(checkRateLimit(ip)).toBe(true);
      }
      // 11th should be blocked
      expect(checkRateLimit(ip)).toBe(false);
    });

    it('tracks different IPs separately', () => {
      const ip1 = '10.0.0.1';
      const ip2 = '10.0.0.2';
      
      for (let i = 0; i < 10; i++) {
        expect(checkRateLimit(ip1)).toBe(true);
      }
      expect(checkRateLimit(ip1)).toBe(false);
      
      // ip2 should still be allowed
      expect(checkRateLimit(ip2)).toBe(true);
    });
  });

  describe('getClientIp', () => {
    it('gets IP from x-forwarded-for', () => {
      const req = new Request('http://localhost', {
        headers: { 'x-forwarded-for': '203.0.113.195' }
      });
      expect(getClientIp(req)).toBe('203.0.113.195');
    });

    it('falls back to x-real-ip', () => {
      const req = new Request('http://localhost', {
        headers: { 'x-real-ip': '203.0.113.196' }
      });
      expect(getClientIp(req)).toBe('203.0.113.196');
    });

    it('returns unknown-ip when no headers present', () => {
      const req = new Request('http://localhost');
      expect(getClientIp(req)).toBe('unknown-ip');
    });
  });
});
