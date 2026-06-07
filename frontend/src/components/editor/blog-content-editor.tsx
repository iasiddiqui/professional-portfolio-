'use client';

import { Clock, Eye, FileCode2, FileUp, Globe, Type } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { MdxEditor } from '@/components/editor/mdx-editor';
import { RichTextEditor } from '@/components/editor/rich-text-editor';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { ContentFormat } from '@/features/blog/types/blog.types';
import { ContentRenderer } from '@/features/public/components/content-renderer';
import { cn } from '@/lib/utils';
import { calculateReadingTimeMinutes, countWords } from '@/utils/reading-time';

type EditorTab = 'rich' | 'mdx' | 'html' | 'preview';

const TAB_CONFIG: Record<
  Exclude<EditorTab, 'preview'>,
  { label: string; icon: typeof Type; format: ContentFormat; hint: string }
> = {
  rich: {
    label: 'Rich text',
    icon: Type,
    format: 'HTML',
    hint: 'Visual editor — saves as HTML.',
  },
  mdx: {
    label: 'MDX / Markdown',
    icon: FileCode2,
    format: 'MDX',
    hint: 'Code editor for MDX or Markdown (.mdx, .md files).',
  },
  html: {
    label: 'HTML',
    icon: Globe,
    format: 'HTML',
    hint: 'Raw HTML source (.html files).',
  },
};

const PREVIEW_HINT = 'Live preview — how your post will look when published.';

function tabForFormat(format: ContentFormat): Exclude<EditorTab, 'preview'> {
  if (format === 'HTML') return 'rich';
  return 'mdx';
}

function formatForTab(
  tab: Exclude<EditorTab, 'preview'>,
  currentFormat: ContentFormat,
): ContentFormat {
  if (tab === 'mdx') {
    return currentFormat === 'MARKDOWN' ? 'MARKDOWN' : 'MDX';
  }
  return 'HTML';
}

function formatFromFilename(filename: string): ContentFormat {
  const lower = filename.toLowerCase();
  if (lower.endsWith('.html') || lower.endsWith('.htm')) return 'HTML';
  if (lower.endsWith('.md')) return 'MARKDOWN';
  return 'MDX';
}

function tabFromFilename(filename: string): Exclude<EditorTab, 'preview'> {
  const lower = filename.toLowerCase();
  if (lower.endsWith('.html') || lower.endsWith('.htm')) return 'html';
  return 'mdx';
}

interface BlogContentEditorProps {
  value: string;
  contentFormat: ContentFormat;
  onChange: (value: string) => void;
  onContentFormatChange: (format: ContentFormat) => void;
  error?: string;
  className?: string;
}

export function BlogContentEditor({
  value,
  contentFormat,
  onChange,
  onContentFormatChange,
  error,
  className,
}: BlogContentEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<EditorTab>(() => tabForFormat(contentFormat));

  useEffect(() => {
    setActiveTab((current) => {
      if (current === 'preview') return current;
      const next = tabForFormat(contentFormat);
      return current === next ? current : next;
    });
  }, [contentFormat]);

  const content = value ?? '';
  const plainText = content.replace(/<[^>]+>/g, ' ');
  const wordCount = countWords(plainText);
  const readingTime = calculateReadingTimeMinutes(plainText);

  const switchTab = (tab: EditorTab) => {
    setActiveTab(tab);
    if (tab !== 'preview') {
      onContentFormatChange(formatForTab(tab, contentFormat));
    }
  };

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowed = /\.(mdx?|html?)$/i;
    if (!allowed.test(file.name)) {
      toast.error('Import .mdx, .md, .html, or .htm files only.');
      event.target.value = '';
      return;
    }

    try {
      const text = await file.text();
      const format = formatFromFilename(file.name);
      const tab = tabFromFilename(file.name);

      onChange(text);
      onContentFormatChange(format);
      setActiveTab(tab);
      toast.success(`Imported ${file.name}`);
    } catch {
      toast.error('Failed to read file');
    }

    event.target.value = '';
  };

  const hint =
    activeTab === 'preview' ? PREVIEW_HINT : TAB_CONFIG[activeTab].hint;

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Label>Content</Label>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>{wordCount} words</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {readingTime} min read
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {(Object.keys(TAB_CONFIG) as Exclude<EditorTab, 'preview'>[]).map((tab) => {
          const config = TAB_CONFIG[tab];
          const Icon = config.icon;
          const isActive = activeTab === tab;

          return (
            <Button
              key={tab}
              type="button"
              size="sm"
              variant={isActive ? 'secondary' : 'outline'}
              onClick={() => switchTab(tab)}
            >
              <Icon className="mr-2 h-4 w-4" />
              {config.label}
            </Button>
          );
        })}

        <Button
          type="button"
          size="sm"
          variant={activeTab === 'preview' ? 'secondary' : 'outline'}
          onClick={() => switchTab('preview')}
        >
          <Eye className="mr-2 h-4 w-4" />
          Preview
        </Button>

        <Button type="button" size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}>
          <FileUp className="mr-2 h-4 w-4" />
          Import file
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".mdx,.md,.html,.htm,text/html,text/markdown"
          className="hidden"
          onChange={handleFileImport}
        />

        <Badge variant="secondary">{contentFormat}</Badge>
      </div>

      {activeTab === 'preview' ? (
        <div className="min-h-[320px] overflow-auto rounded-md border bg-muted/20 p-6">
          {content.trim() ? (
            <ContentRenderer content={content} contentFormat={contentFormat} />
          ) : (
            <p className="text-sm text-muted-foreground">Nothing to preview yet.</p>
          )}
        </div>
      ) : null}

      {activeTab === 'rich' ? (
        <RichTextEditor value={content} onChange={onChange} />
      ) : null}

      {activeTab === 'mdx' ? (
        <div className="space-y-2">
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant={contentFormat === 'MDX' ? 'secondary' : 'outline'}
              onClick={() => onContentFormatChange('MDX')}
            >
              MDX
            </Button>
            <Button
              type="button"
              size="sm"
              variant={contentFormat === 'MARKDOWN' ? 'secondary' : 'outline'}
              onClick={() => onContentFormatChange('MARKDOWN')}
            >
              Markdown
            </Button>
          </div>
          <MdxEditor
            compact
            label=""
            value={content}
            onChange={onChange}
            placeholder={
              contentFormat === 'MARKDOWN'
                ? '# Hello World\n\nWrite Markdown here...'
                : '# Hello World\n\nWrite MDX here...\n\n<Callout>JSX components supported</Callout>'
            }
          />
        </div>
      ) : null}

      {activeTab === 'html' ? (
        <Textarea
          value={content}
          onChange={(event) => onChange(event.target.value)}
          placeholder="<article><h1>Hello</h1><p>HTML content...</p></article>"
          rows={16}
          className="min-h-[320px] font-mono text-sm leading-relaxed"
          spellCheck={false}
        />
      ) : null}

      <p className="text-xs text-muted-foreground">{hint}</p>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
