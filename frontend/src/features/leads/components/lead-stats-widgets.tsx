'use client';

import { Inbox, Sparkles, TrendingUp, CalendarDays } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader } from '@/components/common/loader';
import { ErrorState } from '@/components/common/error-state';
import { useLeadStats } from '@/features/leads/hooks/use-leads';
import { cn } from '@/lib/utils';

interface LeadStatsWidgetsProps {
  className?: string;
  compact?: boolean;
}

const widgets = [
  { key: 'total', label: 'Total Leads', icon: Inbox, field: 'total' as const, suffix: '' },
  { key: 'new', label: 'New Leads', icon: Sparkles, field: 'newLeads' as const, suffix: '' },
  { key: 'conversion', label: 'Conversion Rate', icon: TrendingUp, field: 'conversionRate' as const, suffix: '%' },
  { key: 'monthly', label: 'Monthly Leads', icon: CalendarDays, field: 'monthlyLeads' as const, suffix: '' },
];

export function LeadStatsWidgets({ className, compact = false }: LeadStatsWidgetsProps) {
  const { data, isLoading, isError, refetch } = useLeadStats();

  if (isLoading) return <Loader label="Loading lead stats..." className={className} />;
  if (isError) return <ErrorState title="Failed to load stats" onRetry={() => void refetch()} className={className} />;

  return (
    <div className={cn('grid gap-4 sm:grid-cols-2 xl:grid-cols-4', className)}>
      {widgets.map((widget) => {
        const Icon = widget.icon;
        const value = data?.[widget.field] ?? 0;

        return (
          <Card key={widget.key} className={cn(compact && 'shadow-sm')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{widget.label}</CardTitle>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
                <Icon className="h-4 w-4 text-accent" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold tracking-tight">
                {value}
                {widget.suffix}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
