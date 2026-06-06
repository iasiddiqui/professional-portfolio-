'use client';

import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS, QUERY_STALE_TIME } from '@/constants/query-keys';
import { resumeService } from '@/features/resume/services/resume.service';
import type { ResumeListParams } from '@/features/resume/types/resume.types';

export function useResumes(params?: ResumeListParams) {
  return useQuery({
    queryKey: QUERY_KEYS.resume.list(params),
    queryFn: () => resumeService.list(params),
    staleTime: QUERY_STALE_TIME.default,
  });
}

export function useResume(id: string, enabled = true) {
  return useQuery({
    queryKey: QUERY_KEYS.resume.detail(id),
    queryFn: () => resumeService.getById(id),
    staleTime: QUERY_STALE_TIME.default,
    enabled: Boolean(id) && enabled,
  });
}
