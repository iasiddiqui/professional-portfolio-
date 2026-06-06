import { API_ENDPOINTS } from '@/constants/api';
import { api, apiRequest } from '@/services/api';
import type { ApiResponse, PaginationMeta } from '@/types/api.types';
import type {
  CreateTestimonialPayload,
  Testimonial,
  TestimonialListParams,
  TestimonialListResult,
  UpdateTestimonialPayload,
} from '@/features/testimonials/types/testimonial.types';

async function listTestimonials(params?: TestimonialListParams): Promise<TestimonialListResult> {
  const { data } = await api.get<ApiResponse<Testimonial[]>>(API_ENDPOINTS.testimonials, { params });

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

export const testimonialService = {
  list: listTestimonials,

  getById(id: string) {
    return apiRequest<Testimonial>(() =>
      api.get<ApiResponse<Testimonial>>(`${API_ENDPOINTS.testimonials}/${id}`)
    );
  },

  create(payload: CreateTestimonialPayload) {
    return apiRequest<Testimonial>(() =>
      api.post<ApiResponse<Testimonial>>(API_ENDPOINTS.testimonials, payload)
    );
  },

  update(id: string, payload: UpdateTestimonialPayload) {
    return apiRequest<Testimonial>(() =>
      api.patch<ApiResponse<Testimonial>>(`${API_ENDPOINTS.testimonials}/${id}`, payload)
    );
  },

  delete(id: string) {
    return apiRequest<{ id: string }>(() =>
      api.delete<ApiResponse<{ id: string }>>(`${API_ENDPOINTS.testimonials}/${id}`)
    );
  },
};
