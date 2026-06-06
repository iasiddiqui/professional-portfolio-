import { API_ENDPOINTS } from '@/constants/api';
import { api, apiRequest } from '@/services/api';
import type { ApiResponse } from '@/types/api.types';
import type { PaginationMeta } from '@/types/api.types';
import type {
  BlogListParams,
  BlogListResult,
  BlogPost,
  CreateBlogPostPayload,
  UpdateBlogPostPayload,
} from '@/features/blog/types/blog.types';

async function listBlogPosts(params?: BlogListParams): Promise<BlogListResult> {
  const { data } = await api.get<ApiResponse<BlogPost[]>>(API_ENDPOINTS.blog, { params });

  if (!data.success) {
    throw new Error(data.message);
  }

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

export const blogService = {
  list: listBlogPosts,

  getById(id: string) {
    return apiRequest<BlogPost>(() => api.get<ApiResponse<BlogPost>>(`${API_ENDPOINTS.blog}/${id}`));
  },

  create(payload: CreateBlogPostPayload) {
    return apiRequest<BlogPost>(() => api.post<ApiResponse<BlogPost>>(API_ENDPOINTS.blog, payload));
  },

  update(id: string, payload: UpdateBlogPostPayload) {
    return apiRequest<BlogPost>(() =>
      api.patch<ApiResponse<BlogPost>>(`${API_ENDPOINTS.blog}/${id}`, payload)
    );
  },

  publish(id: string, published: boolean) {
    return apiRequest<BlogPost>(() =>
      api.patch<ApiResponse<BlogPost>>(`${API_ENDPOINTS.blog}/${id}/publish`, { published })
    );
  },

  delete(id: string) {
    return apiRequest<{ id: string }>(() =>
      api.delete<ApiResponse<{ id: string }>>(`${API_ENDPOINTS.blog}/${id}`)
    );
  },
};
