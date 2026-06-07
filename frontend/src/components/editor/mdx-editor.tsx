'use client';

import { Clock, FileCode2 } from 'lucide-react';

import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { calculateReadingTimeMinutes, countWords } from '@/utils/reading-time';
import { cn } from '@/lib/utils';

interface MdxEditorProps {
  id?: string;
  label?: string;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  className?: string;
  minRows?: number;
  compact?: boolean;
}

export function MdxEditor({
  id = 'mdx-content',
  label = 'Content (MDX)',
  value,
  onChange,
  placeholder = '# Hello World\n\nWrite MDX content here...',
  error,
  className,
  minRows = 16,
  compact = false,
}: MdxEditorProps) {
  const content = value ?? '';
  const wordCount = countWords(content);
  const readingTime = calculateReadingTimeMinutes(content);

  return (
    <div className={cn('space-y-2', className)}>
      {!compact ? (
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor={id}>{label}</Label>
            <Badge variant="secondary" className="gap-1">
              <FileCode2 className="h-3 w-3" />
              MDX
            </Badge>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>{wordCount} words</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {readingTime} min read
            </span>
          </div>
        </div>
      ) : null}
      <Textarea
        id={id}
        value={content}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={minRows}
        className="min-h-[320px] font-mono text-sm leading-relaxed"
        spellCheck={false}
      />
      {!compact ? (
        <p className="text-xs text-muted-foreground">
          Supports MDX syntax — headings, code blocks, mermaid diagrams, and markdown formatting.
          Use the Preview tab to see rendered output.
        </p>
      ) : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
