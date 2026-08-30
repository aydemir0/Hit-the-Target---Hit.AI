# Hit.AI

## Live Demo

https://hit-ai.vercel.app

## What It Does

Hit.AI compares a user's candidate profile against a job description. It provides streaming conversational guidance, identifies matched and missing skills, and features a background prioritizer agent that categorizes job postings into Apply, Maybe, or Skip based on empirical evidence. It gracefully falls back to a deterministic demo mode if no API keys are provided.

## Who It Is For

Hit.AI is designed for job seekers and candidates who want AI-assisted career guidance and objective, evidence-based job posting analysis before they spend time applying.

## Usage Examples

1. **Job Posting Inspection:** Paste a lengthy job description into the chat (e.g., "Inspect this job posting: [text]"). Hit.AI extracts the required seniority, core technologies, and structural findings.
2. **Prioritization Agent:** Submit a job description to the Prioritizer tool to instantly determine if the role is a match (Apply/Maybe/Skip) based on your loaded candidate profile.
3. **Conversational Career Chat:** Ask the AI about specific gaps in your experience relative to a desired role, and receive streamed, actionable advice on how to bridge them.

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
- Groq & Anthropic (Supported Providers)

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
| `GROQ_API_KEY` | Yes* | Primary production AI provider. Secret key for Groq AI. *If missing, app uses Demo mode. |
| `GROQ_MODEL` | No | Optional model override if supported (default: `openai/gpt-oss-120b`). |
| `ANTHROPIC_API_KEY` | No | Optional fallback AI provider. Secret key for Anthropic AI. |
| `ANTHROPIC_MODEL` | No | Optional fallback model override if supported (default: `claude-3-5-sonnet-20241022`). |
| `NEXT_PUBLIC_APP_URL` | No | Base URL of the application. |

## Architecture

User
  ↓
Next.js UI
  ↓
/api/chat (Server Action)
  ↓
Request Guard (Rate limits & caps)
  ↓
Vercel AI SDK (with `inspectJobPosting` tool)
  ↓
Groq (Primary API)
  ↓
Streamed response to UI

## V2 Evaluation Results

We ran a controlled, six-case evaluation against the post-build production prioritizer using Groq. The agent successfully passed 5 out of 6 tests.

- **What was evaluated:** The AI's ability to classify job matches, ignore prompt injections, and refuse hallucinating ATS scores.
- **Results:** 5/6 Passed. 1/6 Failed.
- **Key Limitations:** The model correctly resisted prompt injections and hallucinations, but aggressively chose "Skip" when candidate information was sparse instead of correctly identifying it as "Maybe".
- **Detailed Artifact:** [docs/evals/HITAI_V2_EVAL_RESULTS.md](docs/evals/HITAI_V2_EVAL_RESULTS.md)

## Limitations

- **Context-Dependent AI:** AI output strictly depends on the supplied context; sparse inputs yield less useful guidance.
- **Not an ATS Score:** The output is qualitative guidance, not an objective ATS match percentage.
- **Per-Instance Limits:** The in-memory rate limiter is per runtime instance, not globally distributed.
- **Provider Availability:** Live AI functionality depends entirely on Groq/Anthropic API uptime.
- **Text-Only Inspection:** `inspectJobPosting` analyzes the supplied raw text rather than fetching external job data from URLs.

## Design Decisions

**Server-Side Streaming over Client Fetching:** We use server-side streaming (via the Vercel AI SDK on API routes) rather than calling the AI provider directly from the browser. This keeps API credentials strictly private on the server while allowing users to see answers progressively, greatly reducing perceived latency.

## How AI Tools Built This

AI-assisted development was utilized for:
- **Planning Implementation:** Designing the architecture for the server actions, tools, and the fallback demo behavior.
- **Generating React/Next.js Code:** Rapidly scaffolding the streaming UI and the prioritization pages.
- **AI SDK Integration:** Hooking up `streamText`, `generateObject`, and the `inspectJobPosting` tool.
- **Debugging:** Fixing server-action export errors (e.g., extracting Zod schemas from `use server` files) and debugging streaming states.
- **Testing & Guards:** Writing `vitest` suites, implementing the V2 evaluations, and setting up the request caps/rate limiters.

What the developer personally verified and decided:
- **Product Behavior:** Enforcing the "no ATS scoring" rule and designing the Apply/Maybe/Skip outcome states.
- **Engineering Decisions:** Choosing Groq as the primary provider with Anthropic as fallback to optimize latency and cost.
- **Code Review:** Manually verifying that generative UI tool parts didn't leak secrets or break hydration.
- **Testing Real Flows:** Conducting the manual FL-07 browser runs and the final V2 automated evals.
- **Deployment:** Executing and verifying the final Vercel production deployment and environment variable configurations.

## License

This project is licensed under the MIT License.
