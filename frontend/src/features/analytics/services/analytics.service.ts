import { API_ENDPOINTS } from '@/constants/api';
import { api, apiRequest } from '@/services/api';
import type { ApiResponse } from '@/types/api.types';
import type {
  AnalyticsOverview,
  AnalyticsOverviewParams,
} from '@/features/analytics/types/analytics.types';

export const analyticsService = {
  overview(params?: AnalyticsOverviewParams) {
    return apiRequest<AnalyticsOverview>(() =>
      api.get<ApiResponse<AnalyticsOverview>>(`${API_ENDPOINTS.analytics}/overview`, { params })
    );
  },
};
