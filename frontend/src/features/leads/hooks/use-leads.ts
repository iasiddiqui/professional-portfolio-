'use client';

import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS, QUERY_STALE_TIME } from '@/constants/query-keys';
import { leadService } from '@/features/leads/services/lead.service';
import type { LeadListParams } from '@/features/leads/types/lead.types';

export function useLeads(params?: LeadListParams) {
  return useQuery({
    queryKey: QUERY_KEYS.leads.list(params),
    queryFn: () => leadService.list(params),
    staleTime: QUERY_STALE_TIME.default,
  });
}

export function useLead(id: string, enabled = true) {
  return useQuery({
    queryKey: QUERY_KEYS.leads.detail(id),
    queryFn: () => leadService.getById(id),
    staleTime: QUERY_STALE_TIME.default,
    enabled: Boolean(id) && enabled,
  });
}

export function useLeadStats() {
  return useQuery({
    queryKey: QUERY_KEYS.leads.stats,
    queryFn: () => leadService.stats(),
    staleTime: QUERY_STALE_TIME.short,
  });
}
