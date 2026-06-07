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

export function useUpdateProjectStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: UpdateProjectStatusPayload['status'] }) =>
      projectService.updateStatus(id, { status }),
    onSuccess: (project) => {
      queryClient.setQueryData(QUERY_KEYS.projects.detail(project.id), project);
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects.all });
      toast.success(
        project.status === 'PUBLISHED' ? 'Project published' : 'Project unpublished'
      );
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to update status'));
    },
  });
}

export function useBulkUpdateProjectStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      ids,
      status,
    }: {
      ids: string[];
      status: UpdateProjectStatusPayload['status'];
    }) => {
      const results = await Promise.allSettled(
        ids.map((id) => projectService.updateStatus(id, { status }))
      );
      const succeeded = results.filter((result) => result.status === 'fulfilled').length;
      const failed = ids.length - succeeded;

      if (succeeded === 0) {
        throw new Error(
          `Failed to ${status === 'PUBLISHED' ? 'publish' : 'unpublish'} selected projects`
        );
      }

      return { succeeded, failed, status };
    },
    onSuccess: ({ succeeded, failed, status }) => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects.all });
      const action = status === 'PUBLISHED' ? 'published' : 'unpublished';
      if (failed > 0) {
        toast.success(`${succeeded} project(s) ${action}, ${failed} failed`);
      } else {
        toast.success(`${succeeded} project(s) ${action}`);
      }
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Bulk status update failed')),
  });
}

export function useUpdateProjectFeaturedMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, featured }: { id: string; featured: boolean }) =>
      projectService.update(id, { featured }),
    onSuccess: (project) => {
      queryClient.setQueryData(QUERY_KEYS.projects.detail(project.id), project);
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects.all });
      toast.success(project.featured ? 'Project featured' : 'Project unfeatured');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to update featured status'));
    },
  });
}

export function useBulkUpdateProjectFeatured() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ ids, featured }: { ids: string[]; featured: boolean }) => {
      const results = await Promise.allSettled(
        ids.map((id) => projectService.update(id, { featured }))
      );
      const succeeded = results.filter((result) => result.status === 'fulfilled').length;
      const failed = ids.length - succeeded;

      if (succeeded === 0) {
        throw new Error(`Failed to ${featured ? 'feature' : 'unfeature'} selected projects`);
      }

      return { succeeded, failed, featured };
    },
    onSuccess: ({ succeeded, failed, featured }) => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects.all });
      const action = featured ? 'featured' : 'unfeatured';
      if (failed > 0) {
        toast.success(`${succeeded} project(s) ${action}, ${failed} failed`);
      } else {
        toast.success(`${succeeded} project(s) ${action}`);
      }
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Bulk featured update failed')),
  });
}

export function useBulkDeleteProjects() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      const results = await Promise.allSettled(ids.map((id) => projectService.delete(id)));
      const succeeded = results.filter((result) => result.status === 'fulfilled').length;
      const failed = ids.length - succeeded;

      if (succeeded === 0) {
        throw new Error('Failed to delete selected projects');
      }

      return { succeeded, failed };
    },
    onSuccess: ({ succeeded, failed }) => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects.all });
      if (failed > 0) {
        toast.success(`${succeeded} project(s) deleted, ${failed} failed`);
      } else {
        toast.success(`${succeeded} project(s) deleted`);
      }
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Bulk delete failed')),
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
