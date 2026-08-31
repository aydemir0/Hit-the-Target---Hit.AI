# Capstone Reflection: Hit.AI

Building Hit.AI was an intense and rewarding process that merged frontend React development with Vercel's AI SDK. Working on this capstone helped me transition from building simple web prototypes to engineering a production-ready AI application with real constraints and guardrails.

### What was hardest, and why?
The most challenging part of the project was making the AI behavior deterministic enough to evaluate properly, especially when confronted with sparse candidate evidence. During the V2 evaluations, the AI exhibited an overly aggressive "Skip" behavior. I had instructed the agent that "Unknown is not the same as missing," intending for it to output "Maybe" when a candidate's profile was too brief. Instead, the model frequently jumped to the conclusion that a lack of evidence equated to a mismatch. Tuning the prompts and schemas to correctly classify edge cases without breaking the core functionality was a tough balancing act between strictness and helpfulness.

### What would I do differently next time?
Next time, I would invest earlier in generative UI testing and perhaps implement a middle-tier validation layer. Right now, the AI attempts to directly output a complex Zod schema for the job prioritization tool. While it works most of the time, I experienced mid-stream JSON parsing errors and technical failures when the model hallucinated or dropped required keys. In the future, breaking the extraction and the evaluation into two distinct, smaller AI calls might improve reliability and make debugging easier.

### One thing I learned that surprised me
I was surprised by how effectively server-side streaming (via the Vercel AI SDK) handles perceived latency. Initially, I worried that waiting for the AI to analyze a lengthy job posting and a full candidate profile would result in a poor user experience due to API lag. However, by keeping the provider calls purely on the backend and streaming the chunks directly to the UI, the application feels instantly responsive. The user stays engaged reading the first few tokens while the rest of the response is still generating, making the AI's processing time almost invisible.
