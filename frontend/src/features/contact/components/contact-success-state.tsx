import { CheckCircle2, Mail } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface ContactSuccessStateProps {
  title?: string;
  message: string;
  emailSent: boolean;
  onReset: () => void;
  resetLabel?: string;
}

export function ContactSuccessState({
  title = 'Message sent',
  message,
  emailSent,
  onReset,
  resetLabel = 'Send another message',
}: ContactSuccessStateProps) {
  return (
    <div className="glass-panel rounded-2xl p-8 text-center sm:p-10">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-border/60 bg-accent/10">
        <CheckCircle2 className="h-8 w-8 text-accent" />
      </div>
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">{message}</p>
      {emailSent ? (
        <p className="mx-auto mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="h-4 w-4" />
          Check your inbox for a confirmation email.
        </p>
      ) : null}
      <Button variant="outline" className="mt-8" onClick={onReset}>
        {resetLabel}
      </Button>
    </div>
  );
}
