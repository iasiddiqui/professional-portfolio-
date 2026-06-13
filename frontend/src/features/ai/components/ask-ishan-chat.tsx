'use client';

import { Loader2, Send, Sparkles, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ChatMessageContent } from '@/features/ai/components/chat-message-content';
import { useAskIshan } from '@/features/ai/hooks/use-ai-mutations';
import type { ChatMessage } from '@/features/ai/types/ai.types';
import { cn } from '@/lib/utils';

const STARTER_PROMPTS = [
  'What services do you offer?',
  'What kind of projects have you built?',
  'Explain React hooks simply',
  'How do I start a project with you?',
];

function createSessionId() {
  return crypto.randomUUID();
}

interface AskIshanChatProps {
  className?: string;
  onClose?: () => void;
}

export function AskIshanChat({ className, onClose }: AskIshanChatProps = {}) {
  const [sessionId] = useState(createSessionId);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "Hi, I'm Ask Ishan AI. Ask about Ishan's work, services, and projects — or general dev questions, learning tips, and more.",
    },
  ]);

  const askMutation = useAskIshan();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior, block: 'end' });
  }, []);

  useEffect(() => {
    scrollToBottom();
    const frame = requestAnimationFrame(() => scrollToBottom('instant'));
    return () => cancelAnimationFrame(frame);
  }, [messages, askMutation.isPending, scrollToBottom]);

  const canSend = input.trim().length > 0 && !askMutation.isPending;

  const submitMessage = async (message: string) => {
    const trimmed = message.trim();
    if (!trimmed || askMutation.isPending) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      const result = await askMutation.mutateAsync({ message: trimmed, sessionId });
      setMessages((prev) => [
        ...prev,
        { id: result.id, role: 'assistant', content: result.reply },
      ]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to get a response');
    }
  };

  const isFloating = Boolean(onClose);

  return (
    <div
      className={cn(
        'flex h-[min(720px,calc(100vh-12rem))] flex-col overflow-hidden rounded-2xl border border-border/60',
        isFloating ? 'bg-card text-card-foreground shadow-2xl' : 'glass-panel',
        className
      )}
    >
      <div className="flex items-center gap-3 border-b border-border/60 bg-card px-5 py-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-accent/10">
          <Sparkles className="h-5 w-5 text-accent" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-foreground">Ask Ishan AI</p>
          <p className="text-xs text-muted-foreground">Portfolio-aware · General help too</p>
        </div>
        {onClose ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            aria-label="Close chat"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        ) : null}
      </div>

      <div
        className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-card px-5 py-5"
        aria-live="polite"
        aria-relevant="additions"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn('flex', message.role === 'user' ? 'justify-end' : 'justify-start')}
          >
            <div
              className={cn(
                'max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
                message.role === 'user'
                  ? 'bg-accent text-white'
                  : 'border border-border bg-muted text-foreground'
              )}
            >
              {message.role === 'assistant' ? (
                <ChatMessageContent content={message.content} />
              ) : (
                message.content
              )}
            </div>
          </div>
        ))}

        {askMutation.isPending ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Thinking...
          </div>
        ) : null}
        <div ref={messagesEndRef} className="h-px shrink-0" aria-hidden />
      </div>

      {messages.length <= 1 ? (
        <div className="flex flex-wrap gap-2 border-t border-border/60 bg-card px-5 py-3">
          {STARTER_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => void submitMessage(prompt)}
              className="rounded-full border border-border bg-background px-3 py-1.5 text-xs text-foreground transition-colors hover:border-accent/40 hover:bg-muted"
            >
              {prompt}
            </button>
          ))}
        </div>
      ) : null}

      <form
        className="flex gap-3 border-t border-border/60 bg-card p-4"
        onSubmit={(event) => {
          event.preventDefault();
          void submitMessage(input);
        }}
      >
        <Textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask about Ishan, projects, dev topics, or anything else..."
          rows={2}
          className="min-h-[52px] resize-none bg-background text-foreground"
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              void submitMessage(input);
            }
          }}
        />
        <Button type="submit" disabled={!canSend} className="self-end">
          {askMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  );
}
