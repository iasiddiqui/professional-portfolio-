import type { ContentFormat } from '@/features/blog/types/blog.types';
import { HtmlContent } from '@/features/public/components/html-content';
import { MarkdownContent } from '@/features/public/components/markdown-content';

interface ContentRendererProps {
  content: string;
  contentFormat?: ContentFormat | string;
  className?: string;
  variant?: 'default' | 'preview';
}

export function ContentRenderer({
  content,
  contentFormat,
  className,
  variant = 'default',
}: ContentRendererProps) {
  const format = contentFormat?.toUpperCase();

  if (format === 'HTML' || (!format && content.trimStart().startsWith('<'))) {
    return <HtmlContent content={content} className={className} />;
  }

  return <MarkdownContent content={content} className={className} variant={variant} />;
}
