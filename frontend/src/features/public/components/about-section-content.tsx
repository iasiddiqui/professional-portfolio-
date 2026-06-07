import { parseAboutContent } from '@/features/about/lib/about-content';
import { AboutTimeline } from '@/features/public/components/about/about-timeline';
import { ContentRenderer } from '@/features/public/components/content-renderer';
import { cn } from '@/lib/utils';

interface AboutSectionContentProps {
  content: string;
  className?: string;
}

export function AboutSectionContent({ content, className }: AboutSectionContentProps) {
  const parsed = parseAboutContent(content);

  if (parsed.format === 'timeline') {
    return <AboutTimeline entries={parsed.entries} className={className} />;
  }

  if (parsed.format === 'text') {
    return (
      <div className={cn('space-y-3 text-muted-foreground', className)}>
        {parsed.body.split('\n\n').map((paragraph, index) => (
          <p key={index} className="leading-relaxed">
            {paragraph.trim()}
          </p>
        ))}
      </div>
    );
  }

  return <ContentRenderer content={parsed.raw} className={cn('text-muted-foreground', className)} />;
}
