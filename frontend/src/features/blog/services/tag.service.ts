import { API_ENDPOINTS } from '@/constants/api';
import { api, apiRequest } from '@/services/api';
import type { ApiResponse } from '@/types/api.types';
import type { CreateTagPayload, TagEntity, UpdateTagPayload } from '@/features/blog/types/blog.types';

export const tagService = {
  list() {
    return apiRequest<TagEntity[]>(() => api.get<ApiResponse<TagEntity[]>>(API_ENDPOINTS.tags));
  },

  create(payload: CreateTagPayload) {
    return apiRequest<TagEntity>(() =>
      api.post<ApiResponse<TagEntity>>(API_ENDPOINTS.tags, payload)
    );
  },

  update(id: string, payload: UpdateTagPayload) {
    return apiRequest<TagEntity>(() =>
      api.patch<ApiResponse<TagEntity>>(`${API_ENDPOINTS.tags}/${id}`, payload)
    );
  },

  delete(id: string) {
    return apiRequest<{ id: string }>(() =>
      api.delete<ApiResponse<{ id: string }>>(`${API_ENDPOINTS.tags}/${id}`)
    );
  },
};
