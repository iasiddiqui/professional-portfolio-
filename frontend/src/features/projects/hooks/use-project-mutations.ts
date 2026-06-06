'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { QUERY_KEYS } from '@/constants/query-keys';
import { getErrorMessage } from '@/lib/errors';
import { projectService } from '@/features/projects/services/project.service';
import type {
  CreateProjectPayload,
  UpdateProjectPayload,
  UpdateProjectStatusPayload,
} from '@/features/projects/types/project.types';

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProjectPayload) => projectService.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects.all });
      toast.success('Project created successfully');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to create project'));
    },
  });
}

export function useUpdateProject(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProjectPayload) => projectService.update(id, payload),
    onSuccess: (project) => {
      queryClient.setQueryData(QUERY_KEYS.projects.detail(id), project);
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects.all });
      toast.success('Project updated successfully');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to update project'));
    },
  });
}

export function useUpdateProjectStatus(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProjectStatusPayload) => projectService.updateStatus(id, payload),
    onSuccess: (project) => {
      queryClient.setQueryData(QUERY_KEYS.projects.detail(id), project);
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects.all });
      toast.success('Project status updated');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to update status'));
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => projectService.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects.all });
      toast.success('Project deleted successfully');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to delete project'));
    },
  });
}
