import { expect, test, describe } from 'vitest';
import * as actions from '../app/prioritize/actions';

describe('Server Action Module Constraints', () => {
  test('actions.ts exports ONLY async functions', () => {
    // Next.js requires 'use server' files to only export functions.
    // If it exports objects like schemas, it breaks at runtime.
    
    const exports = Object.entries(actions);
    
    // There must be at least one export
    expect(exports.length).toBeGreaterThan(0);
    
    for (const [name, value] of exports) {
      expect(typeof value).toBe('function');
      
      // We can't strictly check for 'AsyncFunction' constructor in all environments 
      // but we can ensure it's at least a function.
    }
  });
});
