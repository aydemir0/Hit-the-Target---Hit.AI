# Hit.AI — Production AI Frontend Capstone

## Project Brief
Hit.AI is an intelligent career-analysis assistant designed for job seekers who want objective, evidence-based feedback on their candidate profiles. By instantly comparing a user's resume and skills against specific job postings, Hit.AI helps candidates optimize their applications and determine if a role is a true match before they invest time applying.

## Live Application
https://hit-ai.vercel.app

## Repository
https://github.com/aydemir0/Hit-the-Target---Hit.AI/tree/fe09-testing-ci

## Architecture & AI Integration
Hit.AI is built on Next.js and the Vercel AI SDK, utilizing Groq as the primary provider with an Anthropic fallback. The application employs server-side streaming to securely invoke AI endpoints while delivering a highly responsive, low-latency chat experience. It features strict production request guards (rate limiting and input caps) and includes a specialized Job Prioritization agent that leverages Generative UI to extract structured job requirements.
[Read the full Architecture in README](../../README.md)

## Testing Evidence
[CAPSTONE_TEST_EVIDENCE.md](CAPSTONE_TEST_EVIDENCE.md)

## Performance & Accessibility
[PERFORMANCE_AUDIT.md](PERFORMANCE_AUDIT.md)
[ACCESSIBILITY_AUDIT.md](ACCESSIBILITY_AUDIT.md)

## Deployment & Operations
[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)

## Known Limitations
- **Sparse Information Handling:** The V2 evaluations revealed that the model aggressively chooses "Skip" when candidate information is sparse, rather than properly classifying the match as "Maybe".
- **No ATS Scoring:** The output provides qualitative guidance, not an objective ATS match percentage.
- **Per-Instance Limits:** The rate limiter is per runtime instance, not globally distributed.
- **Provider Availability:** Live functionality depends entirely on external API uptime.
- **Text-Only Extraction:** The application analyzes raw text pasted by the user rather than fetching external job data from URLs.

## Reflection
[REFLECTION.md](REFLECTION.md)
