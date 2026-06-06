import { cn } from '@/lib/utils';

interface ContentRendererProps {
  content: string;
  className?: string;
}

function renderLine(line: string, index: number) {
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

export function ContentRenderer({ content, className }: ContentRendererProps) {
  const blocks = content.split('\n');

  return (
    <div className={cn('space-y-3', className)}>
      {blocks.map((line, index) => renderLine(line, index))}
    </div>
  );
}
