# Hit.AI

Hit.AI is an AI-powered career assistant designed for job seekers who use LinkedIn and apply directly to job opportunities.

## The Problem

Job seekers often use the same CV and LinkedIn profile for different job applications. This can reduce their chances of matching recruiter searches, ATS systems, and the specific requirements of a job posting.

## What Hit.AI Will Do

Users will be able to provide:

- Their LinkedIn profile information
- Their existing CV
- A target job description

Hit.AI will analyze these inputs and provide:

- LinkedIn profile analysis
- Recruiter keyword and discoverability recommendations
- CV-to-job match score
- Missing skills and keywords
- Tailored CV suggestions
- Cover letter generation
- LinkedIn post and hashtag suggestions
- Interview preparation recommendations

## MVP

The first version will focus on:

1. LinkedIn profile text input
2. CV upload
3. Job description input
4. AI-powered job match analysis
5. Profile and CV improvement recommendations
6. Tailored application content

## Planned Stack

- **Next.js:** Full-stack framework for rendering UI and managing server-side routes.
- **TypeScript:** Type safety across the frontend UI and API endpoints.
- **Tailwind CSS:** Modern utility-first styling for responsive design.
- **AI API:** Integrates external intelligence for analysis, evaluation, and recommendation tasks.
- **Supabase:** Backend database for storing application assets and data.

## AI & Data Flow Architecture

To keep API credentials secure and handle user data properly, the application follows a server-mediated flow:

```
┌─────────────┐             ┌─────────────────────────┐             ┌────────────┐
│ Frontend UI │ ──────────> │     Next.js Server      │ ──────────> │   AI API   │
│             │ <────────── │  (Route Handlers / APIs)│ <────────── │            │
└─────────────┘             └─────────────────────────┘             └────────────┘
      │                                  │
      │                                  │ (Secrets Management)
      ▼                                  ▼
┌─────────────┐             ┌─────────────────────────┐
│  Supabase   │             │  Environment Variables  │
└─────────────┘             └─────────────────────────┘
```

1. **Secure API Delegation:** All direct communication with the AI API is handled via Next.js Server/Route Handlers. Client-side code does not access the AI API directly, keeping sensitive API keys safely stored on the server via environment variables.
2. **Context construction:** The server processes user inputs (LinkedIn details, CV data, and job descriptions) and prepares structured prompts before sending them to the AI API.
3. **Data Integration:** Supabase serves as the system of record, storing and referencing user inputs, uploaded assets, or processed data.
4. **Result Delivery:** The server receives the analysis from the AI API and delivers the structured results back to the Frontend UI for display.

## Status

Currently in the setup and planning phase.
