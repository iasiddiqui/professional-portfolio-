import { API_ENDPOINTS } from '@/constants/api';
import { api, apiRequest } from '@/services/api';
import type { ApiResponse } from '@/types/api.types';
import type { ProjectMedia } from '@/features/projects/types/project.types';

export const mediaService = {
  upload(file: File, options?: { alt?: string; isThumbnail?: boolean; projectId?: string }) {
    const formData = new FormData();
    formData.append('file', file);

    const params = new URLSearchParams();
    if (options?.alt) params.set('alt', options.alt);
    if (options?.isThumbnail) params.set('isThumbnail', 'true');
    if (options?.projectId) params.set('projectId', options.projectId);

    const query = params.toString();
    const url = query ? `${API_ENDPOINTS.media.upload}?${query}` : API_ENDPOINTS.media.upload;

    return apiRequest<ProjectMedia>(() =>
      api.post<ApiResponse<ProjectMedia>>(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    );
  },

  delete(id: string) {
    return apiRequest<{ id: string }>(() =>
      api.delete<ApiResponse<{ id: string }>>(API_ENDPOINTS.media.delete(id))
    );
  },
};
