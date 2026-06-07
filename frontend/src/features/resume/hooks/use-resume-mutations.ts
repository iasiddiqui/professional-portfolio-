'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { QUERY_KEYS } from '@/constants/query-keys';
import { getErrorMessage } from '@/lib/errors';
import { resumeService } from '@/features/resume/services/resume.service';
import type { CreateResumePayload, UpdateResumePayload } from '@/features/resume/types/resume.types';

export function useCreateResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateResumePayload) => resumeService.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.resume.all });
      toast.success('Resume created successfully');
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Failed to create resume')),
  });
}

export function useUpdateResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateResumePayload }) =>
      resumeService.update(id, payload),
    onSuccess: (resume) => {
      queryClient.setQueryData(QUERY_KEYS.resume.detail(resume.id), resume);
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.resume.all });
      toast.success('Resume updated successfully');
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Failed to update resume')),
  });
}

export function useActivateResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => resumeService.activate(id),
    onSuccess: (resume) => {
      queryClient.setQueryData(QUERY_KEYS.resume.detail(resume.id), resume);
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.resume.all });
      toast.success('Resume activated successfully');
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Failed to activate resume')),
  });
}

export function useSetResumeActive() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      isActive ? resumeService.activate(id) : resumeService.update(id, { isActive: false }),
    onSuccess: (resume, { isActive }) => {
      queryClient.setQueryData(QUERY_KEYS.resume.detail(resume.id), resume);
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.resume.all });
      toast.success(
        isActive
          ? 'Resume set as active. Any previously active resume is now inactive.'
          : 'Resume set as inactive'
      );
    },
    onError: (error, { isActive }) =>
      toast.error(
        getErrorMessage(error, isActive ? 'Failed to activate resume' : 'Failed to deactivate resume')
      ),
  });
}

export function useDeleteResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => resumeService.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.resume.all });
      toast.success('Resume deleted successfully');
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Failed to delete resume')),
  });
}
