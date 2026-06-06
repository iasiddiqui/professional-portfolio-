'use client';

import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS, QUERY_STALE_TIME } from '@/constants/query-keys';
import { settingsService } from '@/features/settings/services/settings.service';

export function useSettings() {
  return useQuery({
    queryKey: QUERY_KEYS.settings.detail,
    queryFn: () => settingsService.get(),
    staleTime: QUERY_STALE_TIME.default,
  });
}
