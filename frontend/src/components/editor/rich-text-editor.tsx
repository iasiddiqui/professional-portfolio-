'use client';

import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import StarterKit from '@tiptap/starter-kit';
import { EditorContent, useEditor } from '@tiptap/react';
import {
  Bold,
  Heading2,
  Heading3,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Strikethrough,
  Unlink,
} from 'lucide-react';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

function ToolbarButton({
  active,
  onClick,
  children,
  label,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  label: string;
}) {
  return (
    <Button
      type="button"
      variant={active ? 'secondary' : 'ghost'}
      size="icon"
      className="h-8 w-8"
      aria-label={label}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write your post content…',
  className,
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class:
          'tiptap prose prose-sm dark:prose-invert max-w-none min-h-[280px] px-3 py-3 focus:outline-none',
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;

    const current = editor.getHTML();
    if (value !== current) {
      editor.commands.setContent(value || '', { emitUpdate: false });
    }
  }, [editor, value]);

  if (!editor) {
    return (
      <div className={cn('min-h-[320px] rounded-md border bg-muted/20', className)} aria-hidden />
    );
  }

  const setLink = () => {
    const previous = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('Link URL', previous ?? 'https://');

    if (url === null) return;

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className={cn('overflow-hidden rounded-md border', className)}>
      <div className="flex flex-wrap items-center gap-0.5 border-b bg-muted/30 p-1">
        <ToolbarButton
          label="Bold"
          active={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Italic"
          active={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Strikethrough"
          active={editor.isActive('strike')}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Heading 2"
          active={editor.isActive('heading', { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Heading 3"
          active={editor.isActive('heading', { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Bullet list"
          active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Numbered list"
          active={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Quote"
          active={editor.isActive('blockquote')}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton label="Add link" active={editor.isActive('link')} onClick={setLink}>
          <Link2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Remove link"
          onClick={() => editor.chain().focus().unsetLink().run()}
        >
          <Unlink className="h-4 w-4" />
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
