# Hit.AI Development Guidelines

## Project Purpose

Hit.AI is an AI-powered career assistant for job seekers.

The application will help users:
- Analyze LinkedIn profile content
- Compare their CV with job descriptions
- Identify missing skills and keywords
- Generate tailored CV suggestions
- Generate cover letters
- Prepare for interviews
- Create LinkedIn posts and hashtag suggestions

## Planned Stack

- Next.js
- TypeScript
- Tailwind CSS
- Supabase
- AI API

## Engineering Rules

- Use TypeScript for application code.
- Avoid `any` unless there is a clear reason.
- Prefer small and reusable components.
- Keep business logic separate from UI components.
- Validate user input.
- Never expose API keys or secrets to the client.
- Store secrets only in environment variables.
- Handle loading, error, and empty states explicitly.
- Do not invent information about a user's CV, experience, education, or skills.
- AI-generated career recommendations must be based on user-provided data.

## AI Rules

- Never fabricate skills or professional experience.
- Clearly separate existing user information from AI recommendations.
- Preserve factual information when tailoring a CV.
- Do not claim guaranteed job placement or guaranteed recruiter visibility.
- Treat uploaded CV and career information as sensitive user data.

## Git Convention

Use Conventional Commits.

Examples:

- `feat: add job description analyzer`
- `fix: handle invalid cv uploads`
- `docs: update project documentation`
- `refactor: simplify profile analysis flow`
- `test: add job match tests`
- `chore: update project configuration`

## Development Philosophy

AI should assist the developer, not replace engineering judgment.

Before applying AI-generated changes:
1. Review the proposed change.
2. Understand what it modifies.
3. Check for security and privacy issues.
4. Verify that the change matches the project requirements.

## FE-03 Learned Project Rules

- Analysis settings forms must trim required text values before applying application-level validation.
- When a form requires custom inline validation, use `noValidate` on the form while retaining semantic required fields, and test submission through the user-visible submit button rather than direct form submission.
- Every form control must have a visible associated label. Validation errors must be programmatically connected using `aria-invalid` and `aria-describedby`.
- Frontend-only settings must not claim persistence and must not introduce API, database, Supabase, or AI calls until persistence is actually implemented.
