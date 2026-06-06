import { Sparkles } from 'lucide-react';

import type { PublicService } from '@/features/public/types/public.types';
import { ContentRenderer } from '@/features/public/components/content-renderer';
import { cn } from '@/lib/utils';

interface ServiceCardProps {
  service: PublicService;
  index: number;
  className?: string;
}

export function ServiceCard({ service, index, className }: ServiceCardProps) {
  return (
    <article
      className={cn(
        'glass-panel group rounded-2xl p-6 transition-all duration-300 hover:border-border',
        className
      )}
    >
      <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl border border-border/60 bg-muted/40">
        <Sparkles className="h-4 w-4 text-accent" />
      </div>
      <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
        Service {String(index + 1).padStart(2, '0')}
      </p>
      <h3 className="mb-3 text-lg font-semibold tracking-tight">{service.title}</h3>
      <ContentRenderer content={service.content} className="text-sm text-muted-foreground" />
    </article>
  );
}
