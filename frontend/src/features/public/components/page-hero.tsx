import type { ReactNode } from 'react';

import { GridBackground } from '@/features/public/components/grid-background';
import { cn } from '@/lib/utils';

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function PageHero({ eyebrow, title, description, actions, className }: PageHeroProps) {
  return (
    <GridBackground>
      <section className={cn('container mx-auto px-4 pb-16 pt-20 sm:pb-20 sm:pt-24', className)}>
        <div className="mx-auto max-w-3xl text-center">
          {eyebrow ? (
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="pb-1 text-4xl font-semibold leading-[1.2] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {description ? (
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {description}
            </p>
          ) : null}
          {actions ? <div className="mt-8 flex flex-wrap items-center justify-center gap-3">{actions}</div> : null}
        </div>
      </section>
    </GridBackground>
  );
}
