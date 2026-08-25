import { anthropic } from '@ai-sdk/anthropic';
import { streamText, convertToModelMessages, createUIMessageStream, createUIMessageStreamResponse } from 'ai';
import { SYSTEM_PROMPT, DEFAULT_MODEL, MAX_OUTPUT_TOKENS } from '@/lib/ai/career-chat-config';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const hasAnthropicKey = !!process.env.ANTHROPIC_API_KEY;
    const modelName = process.env.ANTHROPIC_MODEL || DEFAULT_MODEL;

    // The Anthropic path is the actual AI implementation.
    // The demo stream exists only to make the frontend interaction reviewable without paid credentials.
    if (!hasAnthropicKey) {
      const stream = createUIMessageStream({
        execute: async ({ writer }) => {
          // Wait to ensure client has mounted the stream
          await new Promise(r => setTimeout(r, 100));

          const textPartId = crypto.randomUUID();
          
          writer.write({
            type: 'text-start',
            id: textPartId,
          });

          const text = "This is a **demo response** for career analysis.\n\nSince no Anthropic API key is configured on the server, this fallback stream is playing back a deterministic response to show that streaming, aborting, and UI states function correctly without calling a paid API.\n\nBased on your message, here are some simulated strengths:\n- Strong communication skills\n- UI/UX implementation\n\nAnd potential areas to clarify:\n- Specific metric outcomes\n\nPlease connect an Anthropic API key to interact with the real Claude model.";
          const words = text.split(" ");
          
          for (const word of words) {
            if (req.signal.aborted) {
              break;
            }
            writer.write({
              type: 'text-delta',
              id: textPartId,
              delta: word + " ",
            });
            await new Promise(r => setTimeout(r, 60));
          }

          if (!req.signal.aborted) {
            writer.write({
              type: 'text-end',
              id: textPartId,
            });
          }
        },
      });

      return createUIMessageStreamResponse({
        stream,
      });
    }

    const result = streamText({
      model: anthropic(modelName),
      system: SYSTEM_PROMPT,
      messages: await convertToModelMessages(messages),
      maxOutputTokens: MAX_OUTPUT_TOKENS,
      abortSignal: req.signal,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Error in chat route:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred while processing your request.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
