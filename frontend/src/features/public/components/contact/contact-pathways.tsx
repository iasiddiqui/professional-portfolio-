import Link from 'next/link';
import { ArrowRight, Briefcase, CalendarDays } from 'lucide-react';

import { ROUTES } from '@/constants/routes';

const pathways = [
  {
    href: ROUTES.hireMe,
    icon: Briefcase,
    title: 'Hire me for a project',
    description: 'Full engagement with scope, timeline, and deliverables. Best for product builds and long-term work.',
    cta: 'Start hire request',
  },
  {
    href: ROUTES.consultation,
    icon: CalendarDays,
    title: 'Book a consultation',
    description: 'A focused session for architecture review, technical strategy, or scoping before you commit.',
    cta: 'Request consultation',
  },
] as const;

export function ContactPathways() {
  return (
    <section>
      <div className="mb-6">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Other ways to connect</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-gradient">Not sure where to start?</h2>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {pathways.map(({ href, icon: Icon, title, description, cta }) => (
          <Link
            key={href}
            href={href}
            className="group glass-panel relative overflow-hidden rounded-2xl p-6 transition-shadow hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20"
          >
            <div className="pointer-events-none absolute inset-0 linear-glow opacity-0 transition-opacity group-hover:opacity-50" aria-hidden />
            <div className="relative">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/60 bg-muted/30">
                <Icon className="h-5 w-5 text-muted-foreground" />
              </span>
              <h3 className="mt-4 text-lg font-semibold tracking-tight">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium">
                {cta}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
