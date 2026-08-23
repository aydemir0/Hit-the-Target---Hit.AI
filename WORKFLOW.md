# FE-03 AI-Assisted Workflow Drill

## Setup

I implemented the same capstone-relevant feature twice from the same baseline commit: an "Analysis Settings" form for Hit.AI. Both rounds used Gemini 3.1 Pro High in separate sessions and branches. Round one used `fe03-vague`; round two used `fe03-precise`.

## Round One: Vague Prompt

The only instruction was: "Build an Analysis Settings form for Hit.AI on the main page."

The result compiled and passed lint/build, but it misunderstood the feature. The branch changed only `src/app/page.tsx` and created the main analysis-input flow with LinkedIn profile text, CV upload, and a target job description. It also used `console.log` plus a TODO as the submit behavior. There were no automated tests and no explicit validation rules. This was the clearest AI mistake I caught: the output looked plausible because it matched the README's product context, but it did not implement a settings form.

## Round Two: Precise Workflow

The second prompt referenced `README.md`, `CLAUDE.md`, `package.json`, `src/app/page.tsx`, and `src/app/globals.css`. It explicitly defined the four settings, validation rules, accessibility requirements, scope limits, expected behavior, tests, and verification loop.

The precise branch added `src/components/AnalysisSettingsForm.tsx`, `src/components/AnalysisSettingsForm.test.tsx`, and `vitest.config.mts`, plus a test script and testing dependencies. The form contains Target role, Experience level, Output language, and Strict matching. It trims Target role before enforcing the 2-80 character rule, associates labels and errors accessibly, and reports session-only success without pretending to persist data. Seven behavioral tests passed, followed by a clean lint and production build.

Human review still mattered. The first precise version kept the native `required` attribute but its tests used `fireEvent.submit(form)`, bypassing the browser submission path. That could hide a real issue where native validation prevents the custom inline error from appearing. I corrected this by keeping the field semantically required, adding `noValidate` to the form, and changing the tests to click the visible Save Settings button.

## Conclusion

The vague round was faster to prompt but produced the wrong feature and demanded more interpretation during review. The precise round required more upfront specification, but it reduced ambiguity, covered accessibility and edge cases, and produced executable verification. My main lesson is that AI output is not complete when it looks correct; it is complete when the behavior is specified, reviewed, and verified.
