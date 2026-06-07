'use client';

import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS, QUERY_STALE_TIME } from '@/constants/query-keys';
import { analyticsService } from '@/features/analytics/services/analytics.service';
import type { AnalyticsOverviewParams } from '@/features/analytics/types/analytics.types';

export function useAnalyticsOverview(params?: AnalyticsOverviewParams) {
  return useQuery({
    queryKey: QUERY_KEYS.analytics.overview(params?.range),
    queryFn: () => analyticsService.overview(params),
    staleTime: QUERY_STALE_TIME.short,
  });
}
