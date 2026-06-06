import { API_ENDPOINTS } from '@/constants/api';
import { api, apiRequest } from '@/services/api';
import type { ApiResponse } from '@/types/api.types';
import type { SiteSettings, UpdateSettingsPayload } from '@/features/settings/types/settings.types';

export const settingsService = {
  get() {
    return apiRequest<SiteSettings>(() => api.get<ApiResponse<SiteSettings>>(API_ENDPOINTS.settings));
  },

  update(payload: UpdateSettingsPayload) {
    return apiRequest<SiteSettings>(() =>
      api.patch<ApiResponse<SiteSettings>>(API_ENDPOINTS.settings, payload)
    );
  },
};
