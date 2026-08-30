# Hit.AI — AI Career Analysis

Hit.AI is an intelligent career-analysis assistant that compares your CV and LinkedIn profile against job descriptions to provide actionable insights. It identifies gaps, highlights strengths, and helps job seekers optimize their applications for specific roles.

## Live Demo

https://hit-ai.vercel.app

## What It Does

- AI career analysis comparing CV/profile against a job posting
- Conversational career guidance with a chat-based interface
- Inspects job postings to extract requirements, skills, and seniority
- Streaming responses for a fast and interactive experience
- Demo fallback mode if no AI provider key is supplied

## Screenshots

*(Placeholder for 2 screenshots)*
1. **Main Input Experience:** (Screenshot of the form to enter CV/profile/job description)
2. **Career-Analysis Chat:** (Screenshot of the streaming chat with the AI highlighting strengths and gaps)

## Tech Stack

- Next.js (App Router, API Routes)
- React
- TypeScript
- Tailwind CSS
- Vercel AI SDK
- Anthropic & Groq (Supported Models)

## Run Locally

```bash
git clone https://github.com/aydemir0/Hit-the-Target---Hit.AI.git
cd Hit-the-Target---Hit.AI
npm install
copy .env.example .env.local
npm run dev
```

## Environment Variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_APP_URL` | No | Base URL of the application. |
| `GROQ_API_KEY` | Yes* | Primary production AI provider. Secret key for Groq AI. *If missing, app uses Demo mode. |
| `GROQ_MODEL` | No | Override default Groq model (default: `openai/gpt-oss-120b`). |
| `ANTHROPIC_API_KEY` | No | Optional fallback AI provider. Secret key for Anthropic AI. |
| `ANTHROPIC_MODEL` | No | Override default Anthropic model (default: `claude-3-5-sonnet-20241022`). |

## Architecture

Browser/UI
→ Next.js API route (`src/app/api/chat/route.ts`)
→ Request guard (Rate limiting & payload caps)
→ Vercel AI SDK streaming
→ Groq (Primary) / Anthropic (Optional Fallback) or Demo generator
→ Streamed response back to UI

If no API key is supplied via `GROQ_API_KEY` or `ANTHROPIC_API_KEY`, the server falls back to a deterministic demo mode. This ensures the app can still be previewed and evaluated for UI/UX without burning API credits.

## Production Safety

The production AI route is protected by:
- **Input Caps:** Maximum 30 messages, 12,000 characters per message, and 30,000 total payload characters to prevent excessive context windows.
- **Rate Limiting:** 10 AI requests per 60 seconds per client IP. This is a basic per-instance abuse guard rather than a globally distributed rate limiter.
- **Streaming maxDuration:** Limited to 30 seconds to prevent hanging requests.
- **Server-only API key:** `GROQ_API_KEY` and `ANTHROPIC_API_KEY` are isolated in the server process and never exposed to the client.
- **Abort/Cancel Support:** Streaming is fully abortable if the user cancels or navigates away.

## Key Decisions

- **Streaming Instead of Waiting:** We stream responses through the Vercel AI SDK to minimize perceived latency and keep the user engaged.
- **Server-side Provider Calls:** We handle AI calls purely on the backend to keep API keys secure.
- **Explicit Input Limits:** Caps ensure we don't accidentally incur high costs from user abuse or enormous CVs/job descriptions.
- **Demo Fallback:** Exists to allow reviewers and users to explore the UI and streaming mechanisms without needing an active API key or incurring costs.
- **30s maxDuration:** This is a safe production value that gives the AI enough time to process and stream the bulk of its response while protecting against unclosed Vercel serverless function runs.

## How AI Tools Built This

AI-assisted development was utilized for:
- **Implementation Planning:** Strategizing the integration of the AI request guard and route handler configuration.
- **Next.js/React Iteration:** Scaffolding the initial chat routes, testing sabotage behaviors, and creating the UI stream handlers.
- **AI SDK Integration:** Implementing `streamText` and integrating tools like `inspectJobPosting`.
- **Debugging & Test Validation:** Authoring the vitest suites for request guard and rate-limiting limits.
- **Documentation:** Compiling this README based on existing code architecture and limits.

What the developer had to do:
- **Decide Product Behavior:** Define what happens when requests fail or no API key is provided (demo vs error).
- **Inspect/Review Generated Code:** Ensure AI didn't bypass the Vercel AI SDK tools format and correctly handled the stream chunks.
- **Test Flows:** Run Vitest and Playwright tests locally to ensure edge cases (such as rate limiting sabotage) work.
- **Choose Production Constraints:** Hardcode the 30 message limit, character caps, and 30s `maxDuration` to strike a balance between usability and safety.
- **Verify Deployment:** Ensure Vercel environment variables are correct and smoke test the live instance.

## Known Limitations

- The in-memory rate limit is per runtime instance (per Vercel isolate/pod), meaning horizontal scaling might temporarily allow more requests than the strict limit.
- AI output quality depends on the provided job description and CV context.
- The real production AI experience requires a valid Anthropic or Groq API key; otherwise, responses are deterministic demo data.

## License

This project is licensed under the MIT License.
