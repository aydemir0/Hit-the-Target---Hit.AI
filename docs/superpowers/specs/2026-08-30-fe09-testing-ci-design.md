# FlyRank FE-09 Testing & CI Design

## Overview
Implement component testing with Vitest + React Testing Library and E2E testing with Playwright for the Hit.AI project, satisfying the FE-09 requirements.

## Component Testing Strategy
1. **CareerChat**: Mock `@ai-sdk/react`'s `useChat` to provide deterministic test states (text message rendering, supported tool part, pending, streaming, error, input interaction).
2. **JobApplicationForm**: Validate required fields and successful submission behavior using accessible queries.
3. **JobPostingToolPart**: Test input-streaming, input-available, output-error, output-available (malformed and successful) states.

## Playwright Strategy
- Test the primary Career Chat flow.
- Intercept `**/api/chat` using Playwright routing to prevent real API calls.
- Verify user's message appears and deterministic assistant response appears.

## CI Strategy
- GitHub Actions workflow triggering on `push` and `pull_request`.
- Steps: `npm ci`, `npm test`, `npm run lint`, `npm run build`, `npm run test:e2e`.
