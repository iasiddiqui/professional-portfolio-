import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios';

import { API_BASE_URL, API_TIMEOUT, AUTH_ENDPOINTS } from '@/constants/api';
import { createApiError } from '@/lib/errors';
import type { ApiErrorResponse, ApiResponse } from '@/types/api.types';
import type { SessionRefreshResponse } from '@/types/auth.types';

let isRefreshing = false;
let refreshQueue: Array<(success: boolean) => void> = [];

function processQueue(success: boolean) {
  refreshQueue.forEach((callback) => callback(success));
  refreshQueue = [];
}

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes(AUTH_ENDPOINTS.login) &&
      !originalRequest.url?.includes(AUTH_ENDPOINTS.register) &&
      !originalRequest.url?.includes(AUTH_ENDPOINTS.refresh)
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push((success) => {
            if (!success) {
              reject(createApiError('Session expired', 401));
              return;
            }

            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await api.post<ApiResponse<SessionRefreshResponse>>(AUTH_ENDPOINTS.refresh);
        const success = Boolean(data.success);

        processQueue(success);

        if (!success) {
          throw createApiError('Session expired', 401);
        }

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(false);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    const message = error.response?.data?.message ?? error.message ?? 'Request failed';
    const status = error.response?.status;
    const errors = error.response?.data?.errors;

    return Promise.reject(createApiError(message, status, errors));
  }
);

export async function apiRequest<T>(
  request: () => Promise<{ data: ApiResponse<T> }>
): Promise<T> {
  const { data } = await request();

  if (!data.success) {
    throw createApiError(data.message, undefined, data.errors);
  }

  return data.data;
}
