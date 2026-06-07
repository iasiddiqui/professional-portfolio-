import Link from 'next/link';
import { ArrowRight, CalendarDays, Mail } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';

export function AboutCtaBand() {
  return (
    <section className="glass-panel relative overflow-hidden rounded-2xl p-6 sm:p-8">
      <div className="absolute inset-0 linear-glow opacity-70" aria-hidden />
      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-xl">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Let&apos;s collaborate
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-gradient sm:text-3xl">
            Open to meaningful product work
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Whether you need a full-stack build, a consultation, or a long-term engineering partner —
            I&apos;d love to hear about your project.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:min-w-[220px]">
          <Button asChild variant="accent" className="w-full sm:w-auto">
            <Link href={ROUTES.hireMe}>
              <Mail className="mr-2 h-4 w-4" />
              Hire me
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href={ROUTES.consultation}>
              <CalendarDays className="mr-2 h-4 w-4" />
              Book consultation
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
