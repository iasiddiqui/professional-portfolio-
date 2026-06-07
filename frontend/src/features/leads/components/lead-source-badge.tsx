import { LEAD_SOURCE_COLORS, LEAD_SOURCE_LABELS } from '@/features/leads/config/lead.config';
import type { LeadSource } from '@/features/leads/types/lead.types';
import { cn } from '@/lib/utils';

interface LeadSourceBadgeProps {
  source: LeadSource;
  className?: string;
}

export function LeadSourceBadge({ source, className }: LeadSourceBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        LEAD_SOURCE_COLORS[source],
        className
      )}
    >
      {LEAD_SOURCE_LABELS[source]}
    </span>
  );
}
