'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { QUERY_KEYS } from '@/constants/query-keys';
import { getErrorMessage } from '@/lib/errors';
import { leadService } from '@/features/leads/services/lead.service';
import type {
  CreateLeadNotePayload,
  CreateLeadPayload,
  UpdateLeadPayload,
  UpdateLeadStatusPayload,
} from '@/features/leads/types/lead.types';

export function useCreateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateLeadPayload) => leadService.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.leads.all });
      toast.success('Lead created successfully');
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Failed to create lead')),
  });
}

export function useUpdateLead(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateLeadPayload) => leadService.update(id, payload),
    onSuccess: (lead) => {
      queryClient.setQueryData(QUERY_KEYS.leads.detail(id), lead);
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.leads.all });
      toast.success('Lead updated successfully');
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Failed to update lead')),
  });
}

export function useUpdateLeadStatus(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateLeadStatusPayload) => leadService.updateStatus(id, payload),
    onSuccess: (lead) => {
      queryClient.setQueryData(QUERY_KEYS.leads.detail(id), lead);
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.leads.all });
      toast.success('Lead status updated');
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Failed to update status')),
  });
}

export function useDeleteLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => leadService.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.leads.all });
      toast.success('Lead deleted successfully');
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Failed to delete lead')),
  });
}

export function useAddLeadNote(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateLeadNotePayload) => leadService.addNote(id, payload),
    onSuccess: (lead) => {
      queryClient.setQueryData(QUERY_KEYS.leads.detail(id), lead);
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.leads.all });
      toast.success('Note added');
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Failed to add note')),
  });
}

export function useDeleteLeadNote(leadId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (noteId: string) => leadService.deleteNote(leadId, noteId),
    onSuccess: (lead) => {
      queryClient.setQueryData(QUERY_KEYS.leads.detail(leadId), lead);
      toast.success('Note deleted');
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Failed to delete note')),
  });
}
