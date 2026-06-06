'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { QUERY_KEYS } from '@/constants/query-keys';
import { getErrorMessage } from '@/lib/errors';
import { knowledgeBaseService } from '@/features/knowledge-base/services/knowledge-base.service';
import type {
  CreateKnowledgeBasePayload,
  UpdateKnowledgeBasePayload,
} from '@/features/knowledge-base/types/knowledge-base.types';

export function useCreateKnowledgeBaseEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateKnowledgeBasePayload) => knowledgeBaseService.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.knowledgeBase.all });
      toast.success('Knowledge base entry created successfully');
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Failed to create entry')),
  });
}

export function useUpdateKnowledgeBaseEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateKnowledgeBasePayload }) =>
      knowledgeBaseService.update(id, payload),
    onSuccess: (entry) => {
      queryClient.setQueryData(QUERY_KEYS.knowledgeBase.detail(entry.id), entry);
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.knowledgeBase.all });
      toast.success('Knowledge base entry updated successfully');
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Failed to update entry')),
  });
}

export function useDeleteKnowledgeBaseEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => knowledgeBaseService.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.knowledgeBase.all });
      toast.success('Knowledge base entry deleted successfully');
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Failed to delete entry')),
  });
}
