# Hit.AI Demo Script (FL-09)

**Target length:** 3–5 minutes

## Demo Actions & Setup
- **Before recording:** Have a sample job posting text ready (e.g., a generic React/Frontend developer role). Ensure the environment variables are correctly configured so the AI responses stream successfully.
- **0:30–1:10 (Live Site):** Open https://hit-ai.vercel.app. Navigate through the homepage and click to enter the career chat.
- **1:10–2:20 (Live Run):** Paste the job posting into the chat with the prompt: *"Inspect this job posting: [Job text]"*. Wait for the stream to finish and show the structural extraction UI (tool execution).
- **2:20+ (Discussion):** Keep the screen on the generated output while explaining the architecture, limitations, and AI-assisted development.

---

## Script

### 0:00–0:30 (Introduction)
"Hi, welcome to Hit.AI. Job seekers often struggle to tailor their CVs and LinkedIn profiles because they're reusing the same materials for vastly different roles. Hit.AI solves this by acting as an intelligent career-analysis assistant. It's designed to compare your existing profile directly against specific job postings—giving you objective, evidence-based feedback on missing skills or seniority gaps before you spend time applying."

### 0:30–1:10 (Live Production Site)
"Let's look at the live production site. As you can see on the main interface, the core feature is our conversational career guidance chat. Users can provide their candidate profile and then drop in a job description. The AI parses the job requirements and streams back targeted advice."

### 1:10–2:20 (End-to-End Flow)
"I'll demonstrate a live run. I'm going to paste a job posting here and ask the AI to inspect it. 
*(Paste job posting and submit)*
Watch how the response streams in progressively. Behind the scenes, the agent triggered the `inspectJobPosting` tool to structurally extract the required seniority and core technologies from the raw text, returning a clear assessment of what the role actually demands."

### 2:20–3:00 (Design Decision)
"One key design decision we made was relying entirely on server-side streaming via the Vercel AI SDK instead of calling the AI provider from the browser. This approach is critical for security—it keeps our Groq and Anthropic API keys strictly private on the backend. Simultaneously, because we stream the chunks back to the client, the user gets an immediate, interactive experience without waiting for a massive API payload to finish generating."

### 3:00–3:40 (Honest Limitation)
"We're also very honest about the product's current limitations. For instance, Hit.AI does *not* provide an objective ATS match percentage, despite how popular that feature is. The output is purely qualitative guidance based strictly on the text provided. If you supply a sparse job description, the AI won't fetch external data—it will simply flag the requirements as 'Unknown' and give you a 'Maybe' recommendation, which we've seen happen consistently during our evaluations."

### 3:40–4:15 (AI-Assisted Development & V2 Evals)
"AI tools were heavily utilized to build this project—particularly in scaffolding the React and Next.js components, integrating the Vercel AI SDK, and writing our vitest evaluation suites. 
However, I personally verified the product behavior and the V2 evaluation runs. During the V2 evals, we tested the agent against prompt injections and sparse inputs. It passed 5 out of 6 cases, correctly resisting hallucinations, but it did show a limitation where it aggressively rejected candidates with sparse info instead of asking for more details. I reviewed these outcomes, finalized the provider configurations, and verified the Vercel deployments."

### 4:15–4:30 (Closing)
"That's Hit.AI. It’s live right now at hit-ai.vercel.app, helping candidates make data-driven application decisions. Thanks for watching!"
