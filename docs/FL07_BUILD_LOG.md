# FL07 BUILD LOG

## Initial plan
- Build dedicated /prioritize flow
- Use saved candidate profile file as live data source
- Reuse inspectJobPosting
- Use Groq as primary provider

## Cuts / deviations from FL-06 spec
FL-06 originally described the profile as user-entered. For FL-07 MVP, the profile is loaded from a server-side JSON file because the checkpoint explicitly requires a real file/tool/data connection. This keeps the scope small while satisfying the live-data requirement.

## Iteration 1
Problem: Needed a server-side live data source for candidate profile to satisfy the assignment requirement.
Change: Created data/candidate-profile.json and src/lib/ai/tools/load-candidate-profile.ts tool. Implemented passing test.
Result: loadCandidateProfile tool is ready for the agent to use.

## Iteration 2
Problem: Needed an agent flow that compares job postings and candidate profile, returning structured output.
Change: Implemented prioritizeJobPosting server action and Zod schema. Enforced constraints.
Result: Server-side behavior and schema tests pass.

## Iteration 3
Problem: Needed UI for the prioritize page and complete integration with the backend action.
Change: Created the /prioritize page with React state, loading UI, error handling with retry, and the results card.
Result: End-to-end functionality completed and fully tested. TDD loop closed successfully.

## Iteration 4 — Server Action module export failure
Problem: Manual browser testing revealed that /prioritize failed before AI execution with: "A 'use server' file can only export async functions, found object."
Root cause: prioritizationResultSchema (a Zod object) and PrioritizationResult type were exported from actions.ts which had 'use server' directive.
Change: Extracted schema and types into a pure module src/lib/ai/prioritize-schema.ts. Imported them back into actions.ts and tests. Enforced constraint with a regression test.
Result:
- /prioritize no longer throws the "use server" export error.
- Apply eval completed successfully.
- Skip eval completed successfully.
- Maybe eval completed successfully.
- Prompt-injection eval completed successfully.
- Candidate profile evidence from data/candidate-profile.json appeared in the generated result.

## Manual MVP verification
Completed four real browser runs covering the assignment requirements:
- **CASE 1 (Apply)**: Agent correctly identified strong match.
- **CASE 2 (Skip)**: Agent correctly identified major seniority/evidence mismatch.
- **CASE 3 (Maybe)**: Agent correctly noted some matches while flagging missing requirements.
- **CASE 4 (Prompt injection)**: Agent successfully ignored embedded job-posting text attempting to override system instructions.
In all cases, evidence from `data/candidate-profile.json` successfully populated the reasoning.
