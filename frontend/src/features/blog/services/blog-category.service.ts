import { API_ENDPOINTS } from '@/constants/api';
import { api, apiRequest } from '@/services/api';
import type { ApiResponse } from '@/types/api.types';
import type {
  BlogCategory,
  CreateBlogCategoryPayload,
  UpdateBlogCategoryPayload,
} from '@/features/blog/types/blog.types';

export const blogCategoryService = {
  list() {
    return apiRequest<BlogCategory[]>(() =>
      api.get<ApiResponse<BlogCategory[]>>(API_ENDPOINTS.blogCategories)
    );
  },

  create(payload: CreateBlogCategoryPayload) {
    return apiRequest<BlogCategory>(() =>
      api.post<ApiResponse<BlogCategory>>(API_ENDPOINTS.blogCategories, payload)
    );
  },

  update(id: string, payload: UpdateBlogCategoryPayload) {
    return apiRequest<BlogCategory>(() =>
      api.patch<ApiResponse<BlogCategory>>(`${API_ENDPOINTS.blogCategories}/${id}`, payload)
    );
  },

  delete(id: string) {
    return apiRequest<{ id: string }>(() =>
      api.delete<ApiResponse<{ id: string }>>(`${API_ENDPOINTS.blogCategories}/${id}`)
    );
  },
};
