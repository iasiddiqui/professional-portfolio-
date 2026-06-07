import DOMPurify from 'isomorphic-dompurify';

import { cn } from '@/lib/utils';
import type { ContentFormat } from '@/features/blog/types/blog.types';

interface ContentRendererProps {
  content: string;
  contentFormat?: ContentFormat | string;
  className?: string;
}

function renderMarkdownLine(line: string, index: number) {
  const trimmed = line.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith('### ')) {
    return (
      <h4 key={index} className="mt-6 mb-2 text-base font-semibold tracking-tight">
        {trimmed.slice(4)}
      </h4>
    );
  }

  if (trimmed.startsWith('## ')) {
    return (
      <h3 key={index} className="mt-8 mb-3 text-lg font-semibold tracking-tight">
        {trimmed.slice(3)}
      </h3>
    );
  }

  if (trimmed.startsWith('# ')) {
    return (
      <h2 key={index} className="mt-8 mb-3 text-xl font-semibold tracking-tight">
        {trimmed.slice(2)}
      </h2>
    );
  }

  if (trimmed.startsWith('- ')) {
    return (
      <li key={index} className="ml-4 list-disc leading-relaxed">
        {trimmed.slice(2)}
      </li>
    );
  }

  return (
    <p key={index} className="leading-relaxed">
      {trimmed}
    </p>
  );
}

function renderMarkdown(content: string) {
  return content.split('\n').map((line, index) => renderMarkdownLine(line, index));
}

function renderHtml(content: string, className?: string) {
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

export function ContentRenderer({ content, contentFormat, className }: ContentRendererProps) {
  const format = contentFormat?.toUpperCase();

  if (format === 'HTML' || (!format && content.trimStart().startsWith('<'))) {
    return renderHtml(content, className);
  }

  return <div className={cn('space-y-3', className)}>{renderMarkdown(content)}</div>;
}
