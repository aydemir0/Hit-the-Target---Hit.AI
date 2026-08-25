'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useEffect, useRef, useState, FormEvent, KeyboardEvent } from 'react';

export default function CareerChat({ isDemoMode = false }: { isDemoMode?: boolean }) {
  const [input, setInput] = useState('');

  const {
    messages,
    stop,
    status,
    error,
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
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto border-x border-border bg-background relative">
      
      {isDemoMode && (
        <div className="bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-medium px-4 py-2 text-center border-b border-amber-500/20">
          Demo streaming mode — connect an Anthropic API key for live Claude responses.
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
              Welcome! I can help you analyze your career experience against target roles. 
              Paste your resume, a job description, or simply ask for advice to get started.
            </p>
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
                    return null;
                  })}
                </div>
              </div>
            </div>
          ))
        )}

        {/* Thinking Indicator */}
        {showThinking && (
          <div className="flex justify-start">
            <div className="bg-muted text-foreground rounded-2xl rounded-tl-sm px-4 py-3 border border-border" aria-live="polite">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="sr-only">Assistant is thinking...</span>
              </div>
            </div>
          </div>
        )}

        {/* Generic Error State */}
        {error && (
          <div className="flex justify-center my-4" aria-live="assertive">
            <div className="bg-destructive/10 text-destructive border border-destructive/20 rounded-lg p-3 text-sm max-w-md text-center">
              Sorry, there was a problem communicating with the assistant. Please try again.
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
          ↓ Jump to latest
        </button>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-border bg-background">
        <form onSubmit={onSubmit} className="relative flex items-end gap-2 max-w-4xl mx-auto">
          <div className="relative flex-1">
            <label htmlFor="chat-input" className="sr-only">Type your message</label>
            <textarea
              id="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              disabled={isInputDisabled}
              placeholder="Ask for career analysis..."
              className="w-full resize-none rounded-xl border border-input bg-transparent px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 min-h-[52px] max-h-32"
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
