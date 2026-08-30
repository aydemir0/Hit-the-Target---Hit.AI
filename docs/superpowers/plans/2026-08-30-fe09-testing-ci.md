# Implementation Plan: FE-09 Testing & CI

1. **Setup**:
   - Write setup/mock for Vitest tests.
   - Install Playwright.
2. **Component Tests**:
   - Write tests for `CareerChat.tsx`.
   - Write tests for `JobApplicationForm.tsx`.
   - Write tests for `JobPostingToolPart.tsx`.
3. **Playwright Tests**:
   - Setup `playwright.config.ts`.
   - Write `e2e/primary-flow.spec.ts`.
4. **CI Workflow**:
   - Create `.github/workflows/ci.yml`.
5. **Demonstrate RED -> GREEN**:
   - Log a real TDD iteration in `docs/FE09_BUILD_LOG.md`.
6. **Verify & Finalize**:
   - Run tests, lint, build.
   - Report results.
