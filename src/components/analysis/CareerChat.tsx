'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useEffect, useRef, useState, FormEvent, KeyboardEvent } from 'react';
import JobPostingToolPart from './JobPostingToolPart';

export default function CareerChat({ isDemoMode = false }: { isDemoMode?: boolean }) {
  const [input, setInput] = useState('');

  const {
    messages,
    stop,
    status,
    error,
    regenerate,
    sendMessage,
  } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  });

  const viewportRef = useRef<HTMLDivElement>(null);
  const [isPinnedToBottom, setIsPinnedToBottom] = useState(true);
  const [showJumpToBottom, setShowJumpToBottom] = useState(false);

  // Handle auto-scrolling
  const handleScroll = () => {
    if (!viewportRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = viewportRef.current;
    
    // Consider pinned if within 80px of the bottom
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 80;
    
    setIsPinnedToBottom(isNearBottom);
    setShowJumpToBottom(!isNearBottom && messages.length > 0);
  };

  useEffect(() => {
    if (!viewportRef.current) return;
    if (isPinnedToBottom) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  }, [messages, status, isPinnedToBottom]);

  const scrollToBottom = () => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
      setIsPinnedToBottom(true);
      setShowJumpToBottom(false);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    sendMessage({ role: 'user', parts: [{ type: 'text', text: input }] });
    setInput('');
    scrollToBottom();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) {
        sendMessage({ role: 'user', parts: [{ type: 'text', text: input }] });
        setInput('');
        scrollToBottom();
      }
    }
  };

  const isGenerating = status === 'submitted' || status === 'streaming';
  // Empty submission prevention
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSubmit(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!input.trim()) return;
      onKeyDown(e);
    }
  };

  const isInputDisabled = isGenerating;

  // Determine if we should show the thinking indicator
  let showThinking = false;
  if (status === 'submitted') {
    showThinking = true;
  } else if (status === 'streaming') {
    // If streaming but no text parts have text yet in the latest assistant message
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === 'assistant') {
      const hasText = lastMessage.parts?.some(part => part.type === 'text' && part.text.length > 0);
      if (!hasText) {
        showThinking = true;
      }
    } else {
      showThinking = true;
    }
  }

  return (
    <div className="flex flex-col h-[calc(100dvh-4rem)] max-w-4xl mx-auto border-x border-border bg-background relative pb-[env(safe-area-inset-bottom)]">
      
      {isDemoMode && (
        <div className="bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-medium px-4 py-2 text-center border-b border-amber-500/20">
          Demo streaming mode - connect an Anthropic API key for live Claude responses.
        </div>
      )}

      {/* Viewport for messages */}
      <div 
        ref={viewportRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-6"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 text-muted-foreground p-8">
            <h2 className="text-2xl font-bold text-foreground">Career Analysis Chat</h2>
            <p className="max-w-md">
              I can analyze your resume, compare your experience against target roles, and help you prepare for interviews.
            </p>
            <div className="flex flex-col gap-3 mt-6 w-full max-w-xs">
              <button 
                onClick={() => {
                  sendMessage({ role: 'user', parts: [{ type: 'text', text: 'Inspect this job posting:\nJunior Frontend Developer\nReact\nTypeScript\nNext.js\nGit\nREST API' }] });
                }}
                className="text-sm px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors text-left font-medium"
              >
                🔍 Inspect a job posting
              </button>
              <button 
                onClick={() => {
                  sendMessage({ role: 'user', parts: [{ type: 'text', text: 'Help me improve my interview preparation.' }] });
                }}
                className="text-sm px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors text-left font-medium"
              >
                💬 Ask for interview prep
              </button>
              <button 
                onClick={() => {
                  sendMessage({ role: 'user', parts: [{ type: 'text', text: 'Inspect this job posting:\n[[tool-error]]' }] });
                }}
                className="text-sm px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors text-left font-medium"
              >
                ⚠️ Test tool error state
              </button>
            </div>
            
            {isDemoMode && (
              <div className="mt-8 p-4 border border-border rounded-lg text-left w-full max-w-xs bg-card">
                <h3 className="text-sm font-semibold mb-3 text-foreground">Failure demos</h3>
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => {
                      sendMessage(
                        { role: 'user', parts: [{ type: 'text', text: 'Give me a short career analysis demo.' }] },
                        { body: { sabotage: 'mid-stream' satisfies import('@/lib/ai/career-chat-config').SabotageMode } }
                      );
                    }}
                    className="text-xs px-3 py-1.5 bg-muted text-foreground rounded border border-border hover:bg-muted/80 transition-colors"
                  >
                    Mid-stream failure
                  </button>
                  <button 
                    onClick={() => {
                      sendMessage(
                        { role: 'user', parts: [{ type: 'text', text: 'Give me a short career analysis demo.' }] },
                        { body: { sabotage: 'rate-limit' satisfies import('@/lib/ai/career-chat-config').SabotageMode } }
                      );
                    }}
                    className="text-xs px-3 py-1.5 bg-muted text-foreground rounded border border-border hover:bg-muted/80 transition-colors"
                  >
                    Rate limit
                  </button>
                  <button 
                    onClick={() => {
                      sendMessage(
                        { role: 'user', parts: [{ type: 'text', text: 'Give me a short career analysis demo.' }] },
                        { body: { sabotage: 'slow-response' satisfies import('@/lib/ai/career-chat-config').SabotageMode } }
                      );
                    }}
                    className="text-xs px-3 py-1.5 bg-muted text-foreground rounded border border-border hover:bg-muted/80 transition-colors"
                  >
                    Slow response
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          messages.map((m) => (
            <div 
              key={m.id} 
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  m.role === 'user' 
                    ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                    : 'bg-muted text-foreground rounded-tl-sm border border-border'
                }`}
              >
                <div className="text-xs font-semibold mb-1 opacity-75">
                  {m.role === 'user' ? 'You' : 'Hit.AI Assistant'}
                </div>
                
                {/* Render parts safely preserving whitespace */}
                <div className="whitespace-pre-wrap break-words">
                  {m.parts?.map((part, index) => {
                    if (part.type === 'text') {
                      return <span key={index}>{part.text}</span>;
                    }
                    if (part.type === 'tool-inspectJobPosting') {
                      return (
                        <div key={index} className="my-2">
                          <JobPostingToolPart toolInvocation={part as import('./JobPostingToolPart').InspectJobPostingPart} />
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            </div>
          ))
        )}

        {/* Thinking Indicator / Skeleton */}
        {showThinking && (
          <div className="flex justify-start">
            <div className="bg-muted text-foreground rounded-2xl rounded-tl-sm px-4 py-3 border border-border min-w-[240px] max-w-[85%]" aria-live="polite">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="sr-only">Assistant is thinking...</span>
              </div>
              <div className="space-y-2 opacity-30 @media(prefers-reduced-motion:reduce){animate-none}">
                <div className="h-4 bg-foreground rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-foreground rounded w-1/2 animate-pulse"></div>
                <div className="h-4 bg-foreground rounded w-5/6 animate-pulse"></div>
              </div>
            </div>
          </div>
        )}

        {/* Generic Error State */}
        {error && (
          <div className="flex justify-center my-4">
            <div role="alert" className="bg-destructive/10 text-destructive border border-destructive/20 rounded-lg p-4 text-sm max-w-md text-center space-y-3">
              <h3 className="font-semibold text-base">The response was interrupted</h3>
              <p>{(error.message?.includes('429') || error.message?.includes('Too many requests')) ? 'Wait a moment, then retry this response.' : 'An error occurred while generating the response.'}</p>
              <button
                onClick={() => regenerate()}
                disabled={isGenerating}
                className="inline-flex items-center justify-center px-4 py-2 bg-destructive text-destructive-foreground rounded-md font-medium hover:bg-destructive/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
              >
                Retry response
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Jump to bottom button */}
      {showJumpToBottom && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-secondary text-secondary-foreground px-4 py-2 rounded-full shadow-lg border border-border text-sm font-medium hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-transform"
          aria-label="Jump to latest message"
        >
            Jump to latest
        </button>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-border bg-background">
        <form onSubmit={handleFormSubmit} className="relative flex items-end gap-2 max-w-4xl mx-auto">
          <div className="relative flex-1">
            <label htmlFor="chat-input" className="sr-only">Type your message</label>
            <textarea
              id="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isInputDisabled}
              placeholder="Ask for career analysis..."
              className="w-full resize-none rounded-xl border border-input bg-transparent px-4 py-3 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 min-h-[52px] max-h-32"
              rows={1}
            />
          </div>
          
          <div className="flex flex-col gap-2 shrink-0 mb-1">
            {isGenerating ? (
              <button
                type="button"
                onClick={() => stop()}
                className="h-[44px] px-4 bg-destructive text-destructive-foreground rounded-xl font-medium hover:bg-destructive/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
                aria-label="Stop generating"
              >
                Stop
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim() || isInputDisabled}
                className="h-[44px] px-4 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Send message"
              >
                Send
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
