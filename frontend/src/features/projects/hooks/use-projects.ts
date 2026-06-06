'use client';

import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS, QUERY_STALE_TIME } from '@/constants/query-keys';
import { projectService } from '@/features/projects/services/project.service';
import type { ProjectListParams } from '@/features/projects/types/project.types';

export function useProjects(params?: ProjectListParams) {
  return useQuery({
    queryKey: QUERY_KEYS.projects.list(params),
    queryFn: () => projectService.list(params),
    staleTime: QUERY_STALE_TIME.default,
  });
}

export function useProject(id: string, enabled = true) {
  return useQuery({
    queryKey: QUERY_KEYS.projects.detail(id),
    queryFn: () => projectService.getById(id),
    staleTime: QUERY_STALE_TIME.default,
    enabled: Boolean(id) && enabled,
  });
}
