import type { LeadStatus } from '@/features/leads/types/lead.types';
import { LEAD_STATUS_COLORS, LEAD_STATUS_LABELS } from '@/features/leads/config/lead.config';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface LeadStatusBadgeProps {
  status: LeadStatus;
  className?: string;
}

export function LeadStatusBadge({ status, className }: LeadStatusBadgeProps) {
  return (
    <Badge variant="outline" className={cn('border-transparent', LEAD_STATUS_COLORS[status], className)}>
      {LEAD_STATUS_LABELS[status]}
    </Badge>
  );
}
