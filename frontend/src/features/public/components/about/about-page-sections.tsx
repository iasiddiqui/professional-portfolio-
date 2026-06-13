import { Briefcase, GraduationCap, Sparkles, UserRound } from 'lucide-react';

import { getTimelineSectionKind } from '@/features/about/config/about.config';
import { parseAboutContent } from '@/features/about/lib/about-content';
import type { PublicAboutSection } from '@/features/public/types/public.types';
import { AboutCtaBand } from '@/features/public/components/about/about-cta-band';
import { AboutIntro } from '@/features/public/components/about/about-intro';
import { AboutTimelineSection } from '@/features/public/components/about/about-timeline-section';
import { ContentRenderer } from '@/features/public/components/content-renderer';

interface AboutPageSectionsProps {
  sections: PublicAboutSection[];
}

function getSectionSortOrder(title: string): number {
  const kind = getTimelineSectionKind(title);
  if (title.toLowerCase().includes('about')) return 0;
  if (kind === 'experience') return 1;
  if (kind === 'education') return 2;
  return 3;
}

function sortSections(sections: PublicAboutSection[]): PublicAboutSection[] {
  return [...sections].sort((a, b) => {
    const orderDiff = getSectionSortOrder(a.title) - getSectionSortOrder(b.title);
    if (orderDiff !== 0) return orderDiff;
    return a.title.localeCompare(b.title);
  });
}

export function AboutPageSections({ sections }: AboutPageSectionsProps) {
  const sorted = sortSections(sections);
  const introSection = sorted.find((section) => {
    const parsed = parseAboutContent(section.content);
    return parsed.format === 'text' || section.title.toLowerCase().includes('about');
  });

  const timelineSections = sorted.filter((section) => section.id !== introSection?.id);
  const parsedIntro = introSection ? parseAboutContent(introSection.content) : null;

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 linear-glow" aria-hidden />

      <div className="relative mx-auto max-w-6xl space-y-16 px-4 pb-20 sm:space-y-20 sm:pb-24">
        {introSection && parsedIntro?.format === 'text' ? (
          <AboutIntro title={introSection.title} body={parsedIntro.body} />
        ) : introSection ? (
          <section className="glass-panel rounded-2xl p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                <UserRound className="h-5 w-5 text-accent" />
              </div>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{introSection.title}</h2>
            </div>
            <ContentRenderer content={introSection.content} className="text-muted-foreground" />
          </section>
        ) : null}

        {timelineSections.length > 0 ? (
          <div className="mx-auto max-w-3xl space-y-16 lg:max-w-4xl lg:space-y-20">
            {timelineSections.map((section) => {
              const parsed = parseAboutContent(section.content);
              const kind = getTimelineSectionKind(section.title);

              if (parsed.format !== 'timeline') {
                if (parsed.format === 'legacy') return null;

                return (
                  <section key={section.id} className="glass-panel rounded-2xl p-6 sm:p-8">
                    <h2 className="mb-4 text-xl font-semibold tracking-tight">{section.title}</h2>
                    <ContentRenderer content={section.content} className="text-muted-foreground" />
                  </section>
                );
              }

              const Icon = kind === 'education' ? GraduationCap : kind === 'experience' ? Briefcase : Sparkles;

              return (
                <AboutTimelineSection
                  key={section.id}
                  title={section.title}
                  entries={parsed.entries}
                  kind={kind}
                  icon={Icon}
                />
              );
            })}
          </div>
        ) : null}

        <AboutCtaBand />
      </div>
    </div>
  );
}
