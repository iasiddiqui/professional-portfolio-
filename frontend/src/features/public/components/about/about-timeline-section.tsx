import type { LucideIcon } from 'lucide-react';

import type { TimelineSectionKind } from '@/features/about/config/about.config';
import type { AboutTimelineEntry } from '@/features/about/types/about-content.types';
import { AboutTimeline } from '@/features/public/components/about/about-timeline';
import { cn } from '@/lib/utils';

interface AboutTimelineSectionProps {
  title: string;
  entries: AboutTimelineEntry[];
  kind: TimelineSectionKind;
  icon: LucideIcon;
}

const SECTION_COPY: Record<TimelineSectionKind, string | undefined> = {
  experience: 'Roles, companies, and the work that shaped my engineering journey.',
  education: 'Degrees, institutions, and academic foundations.',
  generic: undefined,
};

export function AboutTimelineSection({ title, entries, kind, icon: Icon }: AboutTimelineSectionProps) {
  return (
    <section
      className="glass-panel rounded-2xl p-6 sm:p-8"
      aria-labelledby={`about-section-${title.replace(/\s+/g, '-').toLowerCase()}`}
    >
      <div className="mb-8 flex items-start gap-4 border-b border-border/50 pb-6">
        <div
          className={
            kind === 'experience'
              ? 'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-accent/10'
              : 'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-muted/40'
          }
        >
          <Icon className={cn('h-5 w-5', kind === 'experience' ? 'text-accent' : 'text-foreground/80')} />
        </div>
        <div>
          <h2
            id={`about-section-${title.replace(/\s+/g, '-').toLowerCase()}`}
            className="text-xl font-semibold tracking-tight text-gradient sm:text-2xl"
          >
            {title}
          </h2>
          {SECTION_COPY[kind] ? (
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{SECTION_COPY[kind]}</p>
          ) : null}
        </div>
      </div>

      <AboutTimeline entries={entries} kind={kind} />
    </section>
  );
}
