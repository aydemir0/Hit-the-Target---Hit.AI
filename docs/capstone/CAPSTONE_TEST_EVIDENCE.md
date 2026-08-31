# Capstone Test Evidence

## Test Commands Run
```bash
npm test
npm run test:e2e
```

## Actual Results
- **Unit/Integration (vitest):** 16 test files, 65 tests passed (100%).
- **E2E (Playwright):** 1 test file (2 tests) passed (100%).

## Component Inventory
There are 9 primary meaningful frontend components across the app:
1. `JobApplicationForm` (src/components)
2. `JobApplicationList` (src/components)
3. `JobApplicationTracker` (src/components)
4. `CareerChat` (src/components/analysis)
5. `JobPostingFindings` (src/components/analysis)
6. `JobPostingToolPart` (src/components/analysis)
7. `Home` (src/app/page.tsx)
8. `AnalysisPage` (src/app/analysis/page.tsx)
9. `PrioritizePage` (src/app/prioritize/page.tsx)

## Component Coverage
- **Tested components count:** 6
  - `JobApplicationForm`
  - `CareerChat`
  - `JobPostingFindings`
  - `JobPostingToolPart`
  - `AnalysisPage`
  - `PrioritizePage`
- **Coverage percentage:** ~66% (6 out of 9 meaningful components). This exceeds the capstone requirement of 50%.

## Critical E2E Flow
Our critical path E2E test (`e2e/primary-flow.spec.ts`) verifies the core navigation and rendering. It tests that:
1. The homepage loads and displays the main heading.
2. The user can navigate to the AI Career Analysis page.
3. The chat interface is present and the input form is functional.

## Known Test Limitations
Currently, tests mock the AI backend responses. We do not have full E2E coverage of live AI streaming against the production Groq APIs in CI to avoid flakiness and high costs. We rely on the V2 Evaluation runner for actual integration testing with the provider.
