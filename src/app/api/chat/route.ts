import { anthropic } from '@ai-sdk/anthropic';
import { streamText, convertToModelMessages, createUIMessageStream, createUIMessageStreamResponse } from 'ai';
import { SYSTEM_PROMPT, DEFAULT_MODEL, MAX_OUTPUT_TOKENS, SabotageMode } from '@/lib/ai/career-chat-config';
import { inspectJobPostingTool, execute } from '@/lib/ai/tools/inspect-job-posting';

import type { UIMessage, TextUIPart } from 'ai';

export const dynamic = 'force-dynamic';

export function getTextFromUIMessage(message: UIMessage): string {
  if (!message || !Array.isArray(message.parts)) {
    return '';
  }
  return message.parts
    .filter((part): part is TextUIPart => part.type === 'text')
    .map(part => part.text)
    .join('\n');
}

export function extractJobDescriptionRequest(message: UIMessage): string | null {
  if (message?.role !== 'user') return null;
  const text = getTextFromUIMessage(message);
  const normalizedText = text.trim();
  const prefix = 'inspect this job posting:';
  if (!normalizedText.toLowerCase().startsWith(prefix)) {
    return null;
  }
  return normalizedText.substring(prefix.length).trim();
}

export async function POST(req: Request) {
  try {
    const { messages, sabotage } = await req.json();
    const hasAnthropicKey = !!process.env.ANTHROPIC_API_KEY;
    const modelName = process.env.ANTHROPIC_MODEL || DEFAULT_MODEL;

    // The Anthropic path is the actual AI implementation.
    // The demo stream exists only to make the frontend interaction reviewable without paid credentials.
    if (!hasAnthropicKey) {
      const lastMessage = messages[messages.length - 1];
      const jobDescription = extractJobDescriptionRequest(lastMessage);
      const isToolRequest = jobDescription !== null;

      const isRateLimit = sabotage === ('rate-limit' satisfies SabotageMode);
      if (isRateLimit) {
        return new Response(JSON.stringify({ error: 'Too many requests' }), { 
          status: 429, 
          headers: { 'Content-Type': 'application/json' } 
        });
      }

      const isSlowResponse = sabotage === ('slow-response' satisfies SabotageMode);
      const isMidStreamError = sabotage === ('mid-stream' satisfies SabotageMode);
      
      const stream = createUIMessageStream({
        execute: async ({ writer }) => {
          if (isSlowResponse) {
            await new Promise(r => setTimeout(r, 2000));
          } else {
            // Wait to ensure client has mounted the stream
            await new Promise(r => setTimeout(r, 100));
          }

          if (isToolRequest) {
            const toolCallId = crypto.randomUUID();
            const input = { jobDescription };

            writer.write({
              type: 'tool-input-start',
              toolCallId,
              toolName: 'inspectJobPosting',
            });
            await new Promise(r => setTimeout(r, 400));
            
            writer.write({
              type: 'tool-input-available',
              toolCallId,
              toolName: 'inspectJobPosting',
              input,
            });
            await new Promise(r => setTimeout(r, 600));
            
            try {
              const output = await execute(input);
              writer.write({
                type: 'tool-output-available',
                toolCallId,
                output,
              });
            } catch (error) {
              writer.write({
                type: 'tool-output-error',
                toolCallId,
                errorText: error instanceof Error ? error.message : String(error),
              });
            }
            return;
          }

          const textPartId = crypto.randomUUID();
          
          writer.write({
            type: 'text-start',
            id: textPartId,
          });

          if (isMidStreamError) {
            writer.write({ type: 'text-delta', id: textPartId, delta: "Here is a " });
            await new Promise(r => setTimeout(r, 200));
            writer.write({ type: 'text-delta', id: textPartId, delta: "simulated " });
            await new Promise(r => setTimeout(r, 200));
            writer.write({ type: 'text-delta', id: textPartId, delta: "response that will fail" });
            await new Promise(r => setTimeout(r, 200));
            
            writer.write({
              type: 'error',
              errorText: 'Simulated mid-stream failure'
            });
            return;
          }

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
      tools: {
        inspectJobPosting: inspectJobPostingTool,
      },
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
