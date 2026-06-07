'use client';

import { Columns2, Rows2, ScrollText } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MarkdownContent } from '@/features/public/components/markdown-content';
import { cn } from '@/lib/utils';

interface MarkdownEditorProps {
  id?: string;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  className?: string;
  minHeight?: number;
}

export function MarkdownEditor({
  id = 'markdown-content',
  value,
  onChange,
  placeholder = '# Hello World\n\nWrite Markdown here...',
  error,
  className,
  minHeight = 480,
}: MarkdownEditorProps) {
  const content = value ?? '';
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const syncingRef = useRef(false);
  const [syncScroll, setSyncScroll] = useState(true);
  const [layout, setLayout] = useState<'split' | 'stacked'>('split');

  const syncScrollPosition = useCallback(
    (source: 'editor' | 'preview') => {
      if (!syncScroll || syncingRef.current) return;

      const editor = editorRef.current;
      const preview = previewRef.current;
      if (!editor || !preview) return;

      syncingRef.current = true;

      const sourceEl = source === 'editor' ? editor : preview;
      const targetEl = source === 'editor' ? preview : editor;
      const sourceMax = sourceEl.scrollHeight - sourceEl.clientHeight;
      const targetMax = targetEl.scrollHeight - targetEl.clientHeight;
      const ratio = sourceMax > 0 ? sourceEl.scrollTop / sourceMax : 0;

      targetEl.scrollTop = ratio * targetMax;

      requestAnimationFrame(() => {
        syncingRef.current = false;
      });
    },
    [syncScroll]
  );

  const paneStyle = { minHeight: `${minHeight}px` };

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          Live preview — like{' '}
          <a
            href="https://markdownlivepreview.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline underline-offset-2"
          >
            Markdown Live Preview
          </a>
        </p>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            size="sm"
            variant={syncScroll ? 'secondary' : 'outline'}
            onClick={() => setSyncScroll((current) => !current)}
            aria-pressed={syncScroll}
          >
            <ScrollText className="mr-2 h-4 w-4" />
            Sync scroll
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setLayout((current) => (current === 'split' ? 'stacked' : 'split'))}
            aria-label={layout === 'split' ? 'Stack panes vertically' : 'Show side by side'}
          >
            {layout === 'split' ? (
              <Rows2 className="h-4 w-4" />
            ) : (
              <Columns2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <div
        className={cn(
          'overflow-hidden rounded-md border',
          layout === 'split' ? 'grid lg:grid-cols-2' : 'grid grid-cols-1'
        )}
      >
        <div className="flex min-h-0 flex-col border-b lg:border-b-0 lg:border-r">
          <div className="border-b bg-muted/40 px-3 py-2">
            <Label htmlFor={id} className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Markdown
            </Label>
          </div>
          <Textarea
            id={id}
            ref={editorRef}
            value={content}
            onChange={(event) => onChange(event.target.value)}
            onScroll={() => syncScrollPosition('editor')}
            placeholder={placeholder}
            spellCheck={false}
            style={paneStyle}
            className="min-h-0 flex-1 resize-none rounded-none border-0 font-mono text-sm leading-relaxed shadow-none focus-visible:ring-0"
          />
        </div>

        <div className="flex min-h-0 flex-col bg-muted/10">
          <div className="border-b bg-muted/40 px-3 py-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Preview</p>
          </div>
          <div
            ref={previewRef}
            onScroll={() => syncScrollPosition('preview')}
            style={paneStyle}
            className="overflow-y-auto p-4"
          >
            {content.trim() ? (
              <MarkdownContent content={content} variant="preview" />
            ) : (
              <p className="text-sm text-muted-foreground">Start typing to see the preview.</p>
            )}
          </div>
        </div>
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
