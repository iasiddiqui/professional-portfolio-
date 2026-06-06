import { API_ENDPOINTS } from '@/constants/api';
import { api, apiRequest } from '@/services/api';
import type { ApiResponse } from '@/types/api.types';
import type { PaginationMeta } from '@/types/api.types';
import type {
  CreateLeadNotePayload,
  CreateLeadPayload,
  Lead,
  LeadListParams,
  LeadListResult,
  LeadStats,
  UpdateLeadPayload,
  UpdateLeadStatusPayload,
} from '@/features/leads/types/lead.types';

async function listLeads(params?: LeadListParams): Promise<LeadListResult> {
  const { data } = await api.get<ApiResponse<Lead[]>>(API_ENDPOINTS.leads, { params });

  if (!data.success) throw new Error(data.message);

  const pagination = (data.meta?.pagination ?? {}) as PaginationMeta;

  return {
    items: data.data,
    pagination: {
      page: pagination.page ?? 1,
      limit: pagination.limit ?? 10,
      total: pagination.total ?? data.data.length,
      totalPages: pagination.totalPages ?? 1,
      hasNextPage: pagination.hasNextPage ?? false,
      hasPreviousPage: pagination.hasPreviousPage ?? false,
    },
  };
}

export const leadService = {
  list: listLeads,

  stats() {
    return apiRequest<LeadStats>(() => api.get<ApiResponse<LeadStats>>(`${API_ENDPOINTS.leads}/stats`));
  },

  getById(id: string) {
    return apiRequest<Lead>(() => api.get<ApiResponse<Lead>>(`${API_ENDPOINTS.leads}/${id}`));
  },

  create(payload: CreateLeadPayload) {
    return apiRequest<Lead>(() => api.post<ApiResponse<Lead>>(API_ENDPOINTS.leads, payload));
  },

  update(id: string, payload: UpdateLeadPayload) {
    return apiRequest<Lead>(() => api.patch<ApiResponse<Lead>>(`${API_ENDPOINTS.leads}/${id}`, payload));
  },

  updateStatus(id: string, payload: UpdateLeadStatusPayload) {
    return apiRequest<Lead>(() =>
      api.patch<ApiResponse<Lead>>(`${API_ENDPOINTS.leads}/${id}/status`, payload)
    );
  },

  delete(id: string) {
    return apiRequest<{ id: string }>(() =>
      api.delete<ApiResponse<{ id: string }>>(`${API_ENDPOINTS.leads}/${id}`)
    );
  },

  addNote(id: string, payload: CreateLeadNotePayload) {
    return apiRequest<Lead>(() =>
      api.post<ApiResponse<Lead>>(`${API_ENDPOINTS.leads}/${id}/notes`, payload)
    );
  },

  deleteNote(leadId: string, noteId: string) {
    return apiRequest<Lead>(() =>
      api.delete<ApiResponse<Lead>>(`${API_ENDPOINTS.leads}/${leadId}/notes/${noteId}`)
    );
  },
};
