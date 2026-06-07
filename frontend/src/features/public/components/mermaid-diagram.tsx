'use client';

import { useEffect, useId, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

interface MermaidDiagramProps {
  chart: string;
  className?: string;
}

export function MermaidDiagram({ chart, className }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const renderId = useId().replace(/:/g, '');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function renderDiagram() {
      if (!containerRef.current || !chart.trim()) return;

      setError(null);

      try {
        const mermaid = (await import('mermaid')).default;

        mermaid.initialize({
          startOnLoad: false,
          theme: document.documentElement.classList.contains('dark') ? 'dark' : 'neutral',
          securityLevel: 'strict',
          fontFamily: 'inherit',
        });

        const { svg } = await mermaid.render(`mermaid-${renderId}`, chart.trim());

        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to render diagram');
        }
      }
    }

    void renderDiagram();

    return () => {
      cancelled = true;
    };
  }, [chart, renderId]);

  if (error) {
    return (
      <div className={cn('my-4 rounded-lg border border-destructive/40 bg-destructive/5 p-4', className)}>
        <p className="mb-2 text-sm font-medium text-destructive">Diagram could not be rendered</p>
        <pre className="overflow-x-auto text-xs text-muted-foreground">{chart}</pre>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'my-4 flex justify-center overflow-x-auto rounded-lg border border-border bg-card p-4',
        '[&_svg]:max-w-full',
        className
      )}
    />
  );
}
