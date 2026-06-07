'use client';

import { BarChart3, Download, Eye, MousePointerClick, Users } from 'lucide-react';
import { useState } from 'react';

import { EmptyState } from '@/components/common/empty-state';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AnalyticsModuleShell } from '@/features/admin/components/module-shells';
import { ANALYTICS_MODULE_CONFIG, ANALYTICS_RANGE_OPTIONS } from '@/features/analytics/config/analytics.config';
import { useAnalyticsOverview } from '@/features/analytics/hooks/use-analytics';
import { formatVisitorCount } from '@/features/public/utils/format-visitor-count';

export function AnalyticsModuleView() {
  const [range, setRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const { data, isLoading, isError } = useAnalyticsOverview({ range });

  const stats = [
    { label: 'Visitors', value: data?.visitors ?? 0, icon: Users },
    { label: 'Page views', value: data?.pageViews ?? 0, icon: Eye },
    { label: 'Contact requests', value: data?.contactRequests ?? 0, icon: MousePointerClick },
    { label: 'Downloads', value: data?.downloads ?? 0, icon: Download },
  ] as const;

  return (
    <AnalyticsModuleShell>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">{ANALYTICS_MODULE_CONFIG.title}</h2>
            <p className="text-sm text-muted-foreground">{ANALYTICS_MODULE_CONFIG.description}</p>
          </div>
          <Select value={range} onValueChange={(value) => setRange(value as typeof range)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              {ANALYTICS_RANGE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              Loading analytics...
            </CardContent>
          </Card>
        ) : isError ? (
          <EmptyState
            title="Unable to load analytics"
            description="Check that the API is running and you have permission to view analytics."
          />
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map(({ label, value, icon: Icon }) => (
                <Card key={label}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{label}</CardTitle>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-semibold">{formatVisitorCount(value)}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <BarChart3 className="h-4 w-4" />
                  Top pages
                </CardTitle>
                <CardDescription>Most viewed paths in the selected period.</CardDescription>
              </CardHeader>
              <CardContent>
                {data?.topPaths.length ? (
                  <ul className="space-y-3">
                    {data.topPaths.map((item) => (
                      <li
                        key={item.path}
                        className="flex items-center justify-between gap-4 text-sm"
                      >
                        <span className="truncate font-mono text-muted-foreground">{item.path}</span>
                        <span className="shrink-0 font-medium">{formatVisitorCount(item.count)}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No page views recorded yet.</p>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AnalyticsModuleShell>
  );
}
