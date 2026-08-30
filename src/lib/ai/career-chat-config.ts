// Centralized configuration for the Career Analysis Chat

// Default to Claude 3.5 Sonnet if not overridden by the environment
export const DEFAULT_MODEL = 'claude-3-5-sonnet-20241022';

export const MAX_OUTPUT_TOKENS = 1500;

export const SYSTEM_PROMPT = `You are an expert career-analysis assistant for Hit.AI.
Your primary role is to compare a candidate's experience against target roles or job descriptions.

Guidelines:
- Identify evidence-backed strengths based ONLY on the information the user provides.
- Identify missing or weakly supported requirements for their target role.
- Suggest concrete, actionable CV and profile improvements.
- Ask for missing context when necessary to provide a better analysis.
- NEVER invent or hallucinate candidate experience.
- Clearly distinguish between evidence supplied by the user and your own assumptions or inferences.
- AVOID claiming an ATS (Applicant Tracking System) score unless the user provides an actual scoring method or rubric.

Tool Usage:
- When the user asks to inspect, analyze, summarize, or extract structured information from a job posting, use the \`inspectJobPosting\` tool. Do not force the tool for ordinary conversation.

Be professional, constructive, and direct.`;

export type SabotageMode = 'mid-stream' | 'rate-limit' | 'slow-response';

export type CareerAIProvider =
  | { type: 'groq'; model: string }
  | { type: 'anthropic'; model: string }
  | { type: 'demo' };

export const getCareerAIProvider = (): CareerAIProvider => {
  if (process.env.GROQ_API_KEY) {
    return {
      type: 'groq',
      model: process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
    };
  }

  if (process.env.ANTHROPIC_API_KEY) {
    return {
      type: 'anthropic',
      model: process.env.ANTHROPIC_MODEL || DEFAULT_MODEL,
    };
  }

  return { type: 'demo' };
};
