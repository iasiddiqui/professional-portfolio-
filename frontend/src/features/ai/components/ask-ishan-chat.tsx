'use client';

import { Loader2, Send, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAskIshan } from '@/features/ai/hooks/use-ai-mutations';
import type { ChatMessage } from '@/features/ai/types/ai.types';
import { cn } from '@/lib/utils';

const STARTER_PROMPTS = [
  'What services do you offer?',
  'Tell me about your tech stack.',
  'How do I start a project with you?',
  'What kind of projects have you built?',
];

function createSessionId() {
  return crypto.randomUUID();
}

export function AskIshanChat() {
  const [sessionId] = useState(createSessionId);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "Hi, I'm Ask Ishan AI. Ask me about Ishan's experience, services, projects, or how to collaborate.",
    },
  ]);

  const askMutation = useAskIshan();

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

  const messageList = useMemo(() => messages, [messages]);

  return (
    <div className="glass-panel flex h-[min(720px,calc(100vh-12rem))] flex-col overflow-hidden rounded-2xl">
      <div className="flex items-center gap-3 border-b border-border/60 px-5 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/60 bg-accent/10">
          <Sparkles className="h-5 w-5 text-accent" />
        </div>
        <div>
          <p className="font-semibold">Ask Ishan AI</p>
          <p className="text-xs text-muted-foreground">Powered by Gemini · Knowledge base aware</p>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5" aria-live="polite" aria-relevant="additions">
        {messageList.map((message) => (
          <div
            key={message.id}
            className={cn('flex', message.role === 'user' ? 'justify-end' : 'justify-start')}
          >
            <div
              className={cn(
                'max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
                message.role === 'user'
                  ? 'bg-accent text-accent-foreground'
                  : 'border border-border/60 bg-muted/30 text-foreground'
              )}
            >
              {message.content}
            </div>
          </div>
        ))}

        {askMutation.isPending ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Thinking...
          </div>
        ) : null}
      </div>

      {messages.length <= 1 ? (
        <div className="flex flex-wrap gap-2 border-t border-border/60 px-5 py-3">
          {STARTER_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => void submitMessage(prompt)}
              className="rounded-full border border-border/60 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-border hover:text-foreground"
            >
              {prompt}
            </button>
          ))}
        </div>
      ) : null}

      <form
        className="flex gap-3 border-t border-border/60 p-4"
        onSubmit={(event) => {
          event.preventDefault();
          void submitMessage(input);
        }}
      >
        <Textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask about services, experience, or projects..."
          rows={2}
          className="min-h-[52px] resize-none"
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
