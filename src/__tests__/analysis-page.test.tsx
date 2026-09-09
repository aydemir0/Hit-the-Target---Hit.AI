import { describe, test, expect, vi, beforeEach, afterAll } from 'vitest';
import AnalysisPage from '../app/analysis/page';

describe('Analysis Page Demo Mode', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  test('no keys means isDemoMode is true', () => {
    delete process.env.GROQ_API_KEY;
    delete process.env.ANTHROPIC_API_KEY;
    
    const page = AnalysisPage();
    // In React 18 / Next.js Server Components, AnalysisPage is a plain function returning JSX
    
    expect(page.props.children.props.isDemoMode).toBe(true);
  });

  test('Groq key means isDemoMode is false', () => {
    process.env.GROQ_API_KEY = 'fake-groq';
    delete process.env.ANTHROPIC_API_KEY;
    
    const page = AnalysisPage();
    
    expect(page.props.children.props.isDemoMode).toBe(false);
  });

  test('Anthropic key means isDemoMode is false', () => {
    delete process.env.GROQ_API_KEY;
    process.env.ANTHROPIC_API_KEY = 'fake-anthropic';
    
    const page = AnalysisPage();
    
    expect(page.props.children.props.isDemoMode).toBe(false);
  });
});
