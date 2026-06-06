import { API_ENDPOINTS } from '@/constants/api';
import { api, apiRequest } from '@/services/api';
import type { ApiResponse } from '@/types/api.types';
import type { PaginationMeta } from '@/types/api.types';
import type {
  CreateProjectPayload,
  Project,
  ProjectListParams,
  ProjectListResult,
  UpdateProjectPayload,
  UpdateProjectStatusPayload,
} from '@/features/projects/types/project.types';

async function listProjects(params?: ProjectListParams): Promise<ProjectListResult> {
  const { data } = await api.get<ApiResponse<Project[]>>(API_ENDPOINTS.projects, { params });

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

export const projectService = {
  list: listProjects,

  getById(id: string) {
    return apiRequest<Project>(() =>
      api.get<ApiResponse<Project>>(`${API_ENDPOINTS.projects}/${id}`)
    );
  },

  create(payload: CreateProjectPayload) {
    return apiRequest<Project>(() =>
      api.post<ApiResponse<Project>>(API_ENDPOINTS.projects, payload)
    );
  },

  update(id: string, payload: UpdateProjectPayload) {
    return apiRequest<Project>(() =>
      api.patch<ApiResponse<Project>>(`${API_ENDPOINTS.projects}/${id}`, payload)
    );
  },

  updateStatus(id: string, payload: UpdateProjectStatusPayload) {
    return apiRequest<Project>(() =>
      api.patch<ApiResponse<Project>>(`${API_ENDPOINTS.projects}/${id}/status`, payload)
    );
  },

  delete(id: string) {
    return apiRequest<{ id: string }>(() =>
      api.delete<ApiResponse<{ id: string }>>(`${API_ENDPOINTS.projects}/${id}`)
    );
  },
};
