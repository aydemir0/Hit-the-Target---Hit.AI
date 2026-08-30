# Plan FE-11 Production Deployment and README

## 1. AI Route Hardening
- Add `maxDuration = 30` to `src/app/api/chat/route.ts`.
- Implement an in-memory request guard `src/lib/ai/ai-request-guard.ts` for rate limits and input caps.
  - Caps: Max 30 messages, max 12000 chars per message, max 30000 chars total payload.
  - Rate Limiter: 10 requests per 60 seconds per IP, using a simple in-memory store.
- Integrate the guard into `src/app/api/chat/route.ts` to block abusive/invalid requests and return `400` or `429`.

## 2. Production Environment Hygiene
- Update `.env.example` to ensure it only has keys. It currently looks clean. 
- Ensure `ANTHROPIC_API_KEY` is not exposed in public vars.

## 3. Verification
- Add a test file `src/__tests__/ai-request-guard.test.ts` to verify caps and rate limits.
- Run `npm test`, `npm run lint`, `npm run build` to ensure the project builds correctly.

## 4. Write README
- Rewrite `README.md` completely following the requested structure.
- Add "Tech Stack", "Run Locally", "Environment Variables", "Architecture", "Production Safety", "Key Decisions", "How AI Tools Built This" and "Known Limitations".
- Use the provided screenshots or leave instructions to add them.

## 5. Deployment
- Provide Vercel setup/secrets instructions if necessary.
- Deploy via `npx vercel --prod`.
- Run basic smoke test against the live URL.
- Update README live URL.
