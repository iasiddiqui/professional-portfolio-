'use client';

import DOMPurify from 'isomorphic-dompurify';

import { cn } from '@/lib/utils';

interface HtmlContentProps {
  content: string;
  className?: string;
}

export function HtmlContent({ content, className }: HtmlContentProps) {
  const sanitized = DOMPurify.sanitize(content, {
    USE_PROFILES: { html: true },
  });

  return (
    <div
      className={cn(
        'prose prose-sm dark:prose-invert max-w-none leading-relaxed',
        '[&_a]:text-accent [&_a]:underline',
        className
      )}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}
