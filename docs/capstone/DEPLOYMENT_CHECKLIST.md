# Deployment Checklist

## Pre-deploy Checks (Evidence)
- [x] **Tests passing:** Yes, verified via `npm test` and `npm run test:e2e`.
- [x] **Linting passing:** Yes, verified via `npm run lint`.
- [x] **Build successful:** Yes, verified via `npm run build` (Next.js statically generated without errors).
- [x] **Environment Variables:** `GROQ_API_KEY` is confirmed to be present in Vercel production settings. `NEXT_PUBLIC_APP_URL` is omitted as not strictly needed.
- [x] **No exposed secrets:** Checked `src/` to ensure `process.env.GROQ_API_KEY` is only used inside `/api/chat` and server actions (`use server`). Not leaked to client components.
- [x] **Production AI Provider:** Groq is configured as the primary, fallback to Demo if keys are missing.
- [x] **Input limits & Error Handling:** `ai-request-guard.ts` enforces max 30 messages, 12k chars per message, 30k max total. Handled with 400 Bad Request if exceeded.
- [x] **Rate Limiting:** In-memory rate limiting enforces 10 requests per 60 seconds per IP, throwing 429 Too Many Requests. (Limitation: It is instance-scoped, not global).

## Deployment Details
- **Production URL:** [https://hit-ai.vercel.app](https://hit-ai.vercel.app)
- **Deployment Target:** Vercel (Edge network)
- **Current Branch/Commit:** `fe09-testing-ci` branch.
- **Manual Smoke Status:** Evaluated and verified live rendering of `/` and `/analysis` pages.

## Safe Failure Behavior
- **Malformed / oversized input:** The request guard rejects it instantly with HTTP 400 before invoking AI.
- **Provider failure:** If Groq fails or times out (maxDuration 30s), it returns a 500 block. The UI catches it and displays an error state with a "Retry response" button.
- **Demo fallback:** If API keys are rotated or deleted in Vercel, the app does not crash. It automatically uses deterministic demo data.
- **Rate limiting:** Returns 429, UI notifies the user gracefully to wait.

## Rollback Plan
Since this is hosted on Vercel, we can perform an immediate rollback via the Vercel Dashboard if a bad deployment goes live:
1. Navigate to the project's **Deployments** tab in Vercel.
2. Locate the last known-good production deployment.
3. Click the vertical dots (...) and select **Promote to Production** (or **Redeploy** to production). This reverts the site to the stable state within seconds.
Alternatively, revert the offending commit in Git (`git revert <commit>`), merge to the main branch, and allow Vercel CI to auto-deploy the fix.

## Monitoring
**Currently, there is no dedicated external application monitoring or error tracking (like Sentry or Datadog) installed.** 
We rely solely on Vercel's built-in runtime logs and basic analytics for error visibility.
