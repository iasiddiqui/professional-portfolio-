import { API_ENDPOINTS } from '@/constants/api';
import { api, apiRequest } from '@/services/api';
import type { ApiResponse, PaginationMeta } from '@/types/api.types';
import type {
  CreateResumePayload,
  Resume,
  ResumeListParams,
  ResumeListResult,
  ResumeUploadResult,
  UpdateResumePayload,
} from '@/features/resume/types/resume.types';

async function listResumes(params?: ResumeListParams): Promise<ResumeListResult> {
  const { data } = await api.get<ApiResponse<Resume[]>>(API_ENDPOINTS.resume, { params });

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

export const resumeService = {
  list: listResumes,

  getById(id: string) {
    return apiRequest<Resume>(() => api.get<ApiResponse<Resume>>(`${API_ENDPOINTS.resume}/${id}`));
  },

  create(payload: CreateResumePayload) {
    return apiRequest<Resume>(() => api.post<ApiResponse<Resume>>(API_ENDPOINTS.resume, payload));
  },

  upload(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return apiRequest<ResumeUploadResult>(() =>
      api.post<ApiResponse<ResumeUploadResult>>(API_ENDPOINTS.resumeUpload, formData)
    );
  },

  update(id: string, payload: UpdateResumePayload) {
    return apiRequest<Resume>(() =>
      api.patch<ApiResponse<Resume>>(`${API_ENDPOINTS.resume}/${id}`, payload)
    );
  },

  activate(id: string) {
    return apiRequest<Resume>(() =>
      api.patch<ApiResponse<Resume>>(`${API_ENDPOINTS.resume}/${id}/activate`)
    );
  },

  delete(id: string) {
    return apiRequest<{ id: string }>(() =>
      api.delete<ApiResponse<{ id: string }>>(`${API_ENDPOINTS.resume}/${id}`)
    );
  },
};
