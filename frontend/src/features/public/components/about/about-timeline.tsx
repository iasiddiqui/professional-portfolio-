import { splitEntryContent } from '@/features/about/lib/about-content';
import type { TimelineSectionKind } from '@/features/about/config/about.config';
import type { AboutTimelineEntry } from '@/features/about/types/about-content.types';
import { cn } from '@/lib/utils';

interface AboutTimelineProps {
  entries: AboutTimelineEntry[];
  kind?: TimelineSectionKind;
  className?: string;
}

/** Theme uses accent red + neutrals only — differentiate sections by weight, not extra colors. */
function getTimelineStyles(kind: TimelineSectionKind) {
  if (kind === 'experience') {
    return {
      trunk: 'from-accent via-accent/45 to-accent/5',
      nodeBorder: 'border-accent/70 group-hover:border-accent',
      nodeInner: 'bg-accent',
      nodeRing: 'ring-accent/15',
      branch: 'bg-accent/40',
      org: 'text-accent',
      bullet: 'bg-accent',
      nestedBorder: 'border-accent/20',
    };
  }

  return {
    trunk: 'from-foreground/25 via-foreground/12 to-transparent',
    nodeBorder: 'border-border group-hover:border-foreground/40',
    nodeInner: 'bg-foreground/45 dark:bg-foreground/55',
    nodeRing: 'ring-border/80',
    branch: 'bg-border',
    org: 'text-foreground/80',
    bullet: 'bg-muted-foreground/70',
    nestedBorder: 'border-border/80',
  };
}

const CARD_HOVER =
  'transition-all duration-300 hover:border-border hover:shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_20px_50px_-20px_rgba(0,0,0,0.5)]';

export function AboutTimeline({ entries, kind = 'generic', className }: AboutTimelineProps) {
  if (entries.length === 0) return null;

  const styles = getTimelineStyles(kind);

  return (
    <ol className={cn('relative pl-1', className)}>
      <div
        className={cn(
          'absolute bottom-8 left-[15px] top-4 w-px bg-gradient-to-b sm:left-[19px]',
          styles.trunk
        )}
        aria-hidden
      />

      {entries.map((entry, index) => {
        const bullets = splitEntryContent(entry.content);
        const isLast = index === entries.length - 1;

        return (
          <li key={`${entry.role}-${entry.organization}-${index}`} className={cn('group relative flex', !isLast && 'pb-10')}>
            <div className="relative z-10 flex w-8 shrink-0 justify-center pt-5 sm:w-10">
              <div
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-full border-2 bg-background transition-colors sm:h-8 sm:w-8',
                  styles.nodeBorder,
                  'ring-4 ring-background',
                  styles.nodeRing
                )}
              >
                <span className={cn('h-2 w-2 rounded-full sm:h-2.5 sm:w-2.5', styles.nodeInner)} aria-hidden />
              </div>
            </div>

            <div className="relative min-w-0 flex-1 pb-1 pl-2 sm:pl-3">
              <span
                className={cn('absolute left-0 top-[1.65rem] h-px w-3 sm:top-[1.85rem] sm:w-4', styles.branch)}
                aria-hidden
              />

              <article className={cn('glass-panel rounded-2xl p-5 sm:p-6', CARD_HOVER)}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 space-y-1.5">
                    <h3 className="text-base font-semibold leading-snug tracking-tight sm:text-lg">
                      {entry.role}
                    </h3>
                    {entry.organization ? (
                      <p className={cn('text-sm font-medium', styles.org)}>{entry.organization}</p>
                    ) : null}
                  </div>
                  {entry.period ? (
                    <span className="inline-flex w-fit shrink-0 items-center rounded-full border border-border/70 bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
                      {entry.period}
                    </span>
                  ) : null}
                </div>

                {bullets.length > 0 ? (
                  <ul
                    className={cn(
                      'mt-4 space-y-2.5 border-l-2 pl-4 text-sm leading-relaxed text-muted-foreground sm:text-[15px]',
                      styles.nestedBorder
                    )}
                  >
                    {bullets.map((line, bulletIndex) => (
                      <li key={bulletIndex} className="relative pl-1">
                        <span
                          className={cn(
                            'absolute -left-[21px] top-[0.55em] h-1.5 w-1.5 rounded-full',
                            styles.bullet
                          )}
                          aria-hidden
                        />
                        {line}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
