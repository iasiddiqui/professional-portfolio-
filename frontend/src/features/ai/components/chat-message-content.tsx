'use client';

import type { Components } from 'react-markdown';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { cn } from '@/lib/utils';

const chatMarkdownComponents: Components = {
  p({ children, ...props }) {
    return (
      <p {...props} className="mb-2 leading-relaxed last:mb-0">
        {children}
      </p>
    );
  },
  ul({ children, ...props }) {
    return (
      <ul {...props} className="my-2 list-disc space-y-2 pl-4 last:mb-0">
        {children}
      </ul>
    );
  },
  ol({ children, ...props }) {
    return (
      <ol {...props} className="my-2 list-decimal space-y-2 pl-4 last:mb-0">
        {children}
      </ol>
    );
  },
  li({ children, ...props }) {
    return (
      <li {...props} className="leading-relaxed [&>p]:mb-1 [&>p:last-child]:mb-0">
        {children}
      </li>
    );
  },
  strong({ children, ...props }) {
    return (
      <strong {...props} className="font-semibold text-foreground">
        {children}
      </strong>
    );
  },
  em({ children, ...props }) {
    return (
      <em {...props} className="italic">
        {children}
      </em>
    );
  },
  a({ children, href, ...props }) {
    return (
      <a
        {...props}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-accent underline underline-offset-2"
      >
        {children}
      </a>
    );
  },
  h1({ children, ...props }) {
    return (
      <p {...props} className="mb-2 font-semibold leading-relaxed last:mb-0">
        {children}
      </p>
    );
  },
  h2({ children, ...props }) {
    return (
      <p {...props} className="mb-2 font-semibold leading-relaxed last:mb-0">
        {children}
      </p>
    );
  },
  h3({ children, ...props }) {
    return (
      <p {...props} className="mb-2 font-semibold leading-relaxed last:mb-0">
        {children}
      </p>
    );
  },
  h4({ children, ...props }) {
    return (
      <p {...props} className="mb-2 font-semibold leading-relaxed last:mb-0">
        {children}
      </p>
    );
  },
  code({ children, ...props }) {
    return (
      <code
        {...props}
        className="rounded bg-background/80 px-1 py-0.5 font-mono text-[0.85em]"
      >
        {children}
      </code>
    );
  },
  pre({ children }) {
    return (
      <pre className="my-2 overflow-x-auto rounded-md border border-border bg-background/80 p-2 text-xs leading-relaxed last:mb-0">
        {children}
      </pre>
    );
  },
};

interface ChatMessageContentProps {
  content: string;
  className?: string;
}

export function ChatMessageContent({ content, className }: ChatMessageContentProps) {
  return (
    <div className={cn('chat-message-content [&>*:first-child]:mt-0', className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={chatMarkdownComponents}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
