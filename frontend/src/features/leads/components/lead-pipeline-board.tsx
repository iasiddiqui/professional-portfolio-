'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { ErrorState } from '@/components/common/error-state';
import { Loader } from '@/components/common/loader';
import { LeadSourceBadge } from '@/features/leads/components/lead-source-badge';
import { LeadStatusBadge } from '@/features/leads/components/lead-status-badge';
import {
  LEAD_PIPELINE_STATUSES,
  LEAD_STATUS_LABELS,
} from '@/features/leads/config/lead.config';
import { useLeadPipeline } from '@/features/leads/hooks/use-leads';
import { useUpdateLeadStatusMutation } from '@/features/leads/hooks/use-lead-mutations';
import type { LeadPipelineItem, LeadStatus } from '@/features/leads/types/lead.types';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';
import { formatRelativeTime } from '@/utils/date';

interface LeadPipelineBoardProps {
  compact?: boolean;
  limit?: number;
  className?: string;
  canWrite?: boolean;
}

function PipelineCard({
  lead,
  canWrite,
  compact,
}: {
  lead: LeadPipelineItem;
  canWrite?: boolean;
  compact?: boolean;
}) {
  const statusMutation = useUpdateLeadStatusMutation();

  return (
    <div
      className={cn(
        'rounded-lg border bg-card p-3 shadow-sm transition-colors hover:border-accent/40',
        compact && 'p-2.5'
      )}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <Link
            href={ROUTES.admin.lead(lead.id)}
            className={cn('font-medium hover:text-accent', compact ? 'text-sm' : 'text-sm')}
          >
            {lead.name}
          </Link>
          <p className="truncate text-xs text-muted-foreground">{lead.email}</p>
        </div>
        <LeadSourceBadge source={lead.source} />
      </div>

      {!compact && lead.projectType ? (
        <p className="mb-2 text-xs text-muted-foreground">{lead.projectType}</p>
      ) : null}

      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] text-muted-foreground">{formatRelativeTime(lead.createdAt)}</span>
        {canWrite ? (
          <select
            aria-label={`Update status for ${lead.name}`}
            className="h-7 rounded-md border border-input bg-background px-2 text-[11px]"
            value={lead.status}
            disabled={statusMutation.isPending}
            onChange={(event) =>
              statusMutation.mutate({
                id: lead.id,
                status: event.target.value as LeadStatus,
              })
            }
          >
            {LEAD_PIPELINE_STATUSES.map((status) => (
              <option key={status} value={status}>
                {LEAD_STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        ) : (
          <LeadStatusBadge status={lead.status} />
        )}
      </div>
    </div>
  );
}

export function LeadPipelineBoard({
  compact = false,
  limit = 20,
  className,
  canWrite = false,
}: LeadPipelineBoardProps) {
  const { data, isLoading, isError, refetch } = useLeadPipeline(limit);

  if (isLoading) {
    return <Loader label="Loading pipeline..." className={className} />;
  }

  if (isError || !data) {
    return (
      <ErrorState
        title="Failed to load pipeline"
        onRetry={() => void refetch()}
        className={className}
      />
    );
  }

  return (
    <div
      className={cn(
        'grid gap-4',
        compact ? 'md:grid-cols-2 xl:grid-cols-4' : 'md:grid-cols-2 xl:grid-cols-4',
        className
      )}
    >
      {LEAD_PIPELINE_STATUSES.map((status) => {
        const items = data[status];

        return (
          <div key={status} className="flex min-h-[220px] flex-col rounded-xl border bg-muted/20">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div className="flex items-center gap-2">
                <LeadStatusBadge status={status} />
                <span className="text-xs text-muted-foreground">{items.length}</span>
              </div>
            </div>
            <div className={cn('flex flex-1 flex-col gap-2 overflow-y-auto p-3', compact && 'max-h-72')}>
              {items.length === 0 ? (
                <p className="py-6 text-center text-xs text-muted-foreground">No leads</p>
              ) : (
                items.map((lead) => (
                  <PipelineCard key={lead.id} lead={lead} canWrite={canWrite} compact={compact} />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function LeadPipelinePreview({
  canWrite,
  className,
}: {
  canWrite?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <LeadPipelineBoard compact limit={5} canWrite={canWrite} />
      <div className="mt-4 flex justify-end">
        <Link
          href={ROUTES.admin.leads}
          className="inline-flex items-center gap-1 text-sm text-accent hover:underline"
        >
          Open full pipeline
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
