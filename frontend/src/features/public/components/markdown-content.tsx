'use client';

import type { Components } from 'react-markdown';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { MermaidDiagram } from '@/features/public/components/mermaid-diagram';
import { cn } from '@/lib/utils';

interface MarkdownContentProps {
  content: string;
  className?: string;
  variant?: 'default' | 'preview';
}

function getMarkdownComponents(): Components {
  return {
    h1({ children, ...props }) {
      return (
        <h1 {...props} className="mb-4 mt-8 scroll-mt-20 border-b border-border pb-2 text-3xl font-bold tracking-tight first:mt-0">
          {children}
        </h1>
      );
    },
    h2({ children, ...props }) {
      return (
        <h2 {...props} className="mb-3 mt-8 scroll-mt-20 text-2xl font-semibold tracking-tight first:mt-0">
          {children}
        </h2>
      );
    },
    h3({ children, ...props }) {
      return (
        <h3 {...props} className="mb-2 mt-6 scroll-mt-20 text-xl font-semibold tracking-tight first:mt-0">
          {children}
        </h3>
      );
    },
    h4({ children, ...props }) {
      return (
        <h4 {...props} className="mb-2 mt-5 text-lg font-semibold first:mt-0">
          {children}
        </h4>
      );
    },
    p({ children, ...props }) {
      return (
        <p {...props} className="mb-4 leading-7 last:mb-0">
          {children}
        </p>
      );
    },
    ul({ children, ...props }) {
      return (
        <ul {...props} className="mb-4 list-disc space-y-1 pl-6 leading-7 last:mb-0">
          {children}
        </ul>
      );
    },
    ol({ children, ...props }) {
      return (
        <ol {...props} className="mb-4 list-decimal space-y-1 pl-6 leading-7 last:mb-0">
          {children}
        </ol>
      );
    },
    li({ children, ...props }) {
      return (
        <li {...props} className="pl-1">
          {children}
        </li>
      );
    },
    a({ href, children, ...props }) {
      const isExternal = href?.startsWith('http');
      return (
        <a
          href={href}
          {...props}
          className="font-medium text-accent underline underline-offset-2 hover:text-accent/80"
          {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {children}
        </a>
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
      return <em {...props} className="italic">{children}</em>;
    },
    blockquote({ children, ...props }) {
      return (
        <blockquote
          {...props}
          className="my-4 border-l-4 border-accent/50 bg-muted/40 py-2 pl-4 pr-2 text-muted-foreground [&>p]:mb-2 [&>p:last-child]:mb-0"
        >
          {children}
        </blockquote>
      );
    },
    table({ children, ...props }) {
      return (
        <div className="my-6 overflow-x-auto rounded-lg border border-border">
          <table {...props} className="w-full min-w-[480px] border-collapse text-sm">
            {children}
          </table>
        </div>
      );
    },
    thead({ children, ...props }) {
      return <thead {...props} className="bg-muted/60">{children}</thead>;
    },
    th({ children, ...props }) {
      return (
        <th {...props} className="border-b border-border px-4 py-2.5 text-left font-semibold">
          {children}
        </th>
      );
    },
    td({ children, ...props }) {
      return (
        <td {...props} className="border-b border-border/60 px-4 py-2.5 align-top">
          {children}
        </td>
      );
    },
    tr({ children, ...props }) {
      return <tr {...props} className="even:bg-muted/20">{children}</tr>;
    },
    hr() {
      return <hr className="my-8 border-border" />;
    },
    code({ className, children, ...props }) {
      const match = /language-(\w+)/.exec(className ?? '');
      const language = match?.[1];
      const code = String(children).replace(/\n$/, '');

      if (language === 'mermaid') {
        return <MermaidDiagram chart={code} />;
      }

      if (language) {
        return (
          <div className="group relative my-4 overflow-hidden rounded-lg border border-border bg-[#1e1e1e]">
            <div className="flex items-center justify-between border-b border-white/10 bg-[#2d2d2d] px-4 py-1.5">
              <span className="font-mono text-xs uppercase tracking-wide text-white/60">
                {language}
              </span>
            </div>
            <pre className="overflow-x-auto p-4 text-[0.8125rem] leading-relaxed">
              <code {...props} className="font-mono text-[#d4d4d4]">
                {code}
              </code>
            </pre>
          </div>
        );
      }

      if (code.includes('\n')) {
        return (
          <pre className="my-4 overflow-x-auto rounded-lg border border-border bg-muted/80 p-4 text-sm leading-relaxed">
            <code {...props} className="font-mono">{code}</code>
          </pre>
        );
      }

      return (
        <code
          {...props}
          className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.875em] text-foreground"
        >
          {children}
        </code>
      );
    },
    pre({ children }) {
      return <>{children}</>;
    },
  };
}

const markdownComponents = getMarkdownComponents();

export function MarkdownContent({
  content,
  className,
  variant = 'default',
}: MarkdownContentProps) {
  if (!content.trim()) {
    return (
      <p className="text-sm italic text-muted-foreground">
        Start writing markdown to see the preview…
      </p>
    );
  }

  return (
    <article
      className={cn(
        'markdown-content',
        variant === 'preview' ? 'markdown-content--compact' : 'markdown-content--full',
        className
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {content}
      </ReactMarkdown>
    </article>
  );
}
