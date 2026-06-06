'use client';

import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS, QUERY_STALE_TIME } from '@/constants/query-keys';
import { knowledgeBaseService } from '@/features/knowledge-base/services/knowledge-base.service';
import type { KnowledgeBaseListParams } from '@/features/knowledge-base/types/knowledge-base.types';

export function useKnowledgeBaseEntries(params?: KnowledgeBaseListParams) {
  return useQuery({
    queryKey: QUERY_KEYS.knowledgeBase.list(params),
    queryFn: () => knowledgeBaseService.list(params),
    staleTime: QUERY_STALE_TIME.default,
  });
}

export function useKnowledgeBaseEntry(id: string, enabled = true) {
  return useQuery({
    queryKey: QUERY_KEYS.knowledgeBase.detail(id),
    queryFn: () => knowledgeBaseService.getById(id),
    staleTime: QUERY_STALE_TIME.default,
    enabled: Boolean(id) && enabled,
  });
}

export function useKnowledgeBaseCategories() {
  return useQuery({
    queryKey: QUERY_KEYS.knowledgeBase.categories,
    queryFn: () => knowledgeBaseService.getCategories(),
    staleTime: QUERY_STALE_TIME.default,
  });
}
