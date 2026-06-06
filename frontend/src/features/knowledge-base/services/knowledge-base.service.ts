import { API_ENDPOINTS } from '@/constants/api';
import { api, apiRequest } from '@/services/api';
import type { ApiResponse, PaginationMeta } from '@/types/api.types';
import type {
  CreateKnowledgeBasePayload,
  KnowledgeBaseEntry,
  KnowledgeBaseListParams,
  KnowledgeBaseListResult,
  UpdateKnowledgeBasePayload,
} from '@/features/knowledge-base/types/knowledge-base.types';

async function listKnowledgeBaseEntries(
  params?: KnowledgeBaseListParams
): Promise<KnowledgeBaseListResult> {
  const { data } = await api.get<ApiResponse<KnowledgeBaseEntry[]>>(API_ENDPOINTS.knowledgeBase, {
    params,
  });

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

export const knowledgeBaseService = {
  list: listKnowledgeBaseEntries,

  getCategories() {
    return apiRequest<string[]>(() =>
      api.get<ApiResponse<string[]>>(`${API_ENDPOINTS.knowledgeBase}/categories`)
    );
  },

  getById(id: string) {
    return apiRequest<KnowledgeBaseEntry>(() =>
      api.get<ApiResponse<KnowledgeBaseEntry>>(`${API_ENDPOINTS.knowledgeBase}/${id}`)
    );
  },

  create(payload: CreateKnowledgeBasePayload) {
    return apiRequest<KnowledgeBaseEntry>(() =>
      api.post<ApiResponse<KnowledgeBaseEntry>>(API_ENDPOINTS.knowledgeBase, payload)
    );
  },

  update(id: string, payload: UpdateKnowledgeBasePayload) {
    return apiRequest<KnowledgeBaseEntry>(() =>
      api.patch<ApiResponse<KnowledgeBaseEntry>>(`${API_ENDPOINTS.knowledgeBase}/${id}`, payload)
    );
  },

  delete(id: string) {
    return apiRequest<{ id: string }>(() =>
      api.delete<ApiResponse<{ id: string }>>(`${API_ENDPOINTS.knowledgeBase}/${id}`)
    );
  },
};
