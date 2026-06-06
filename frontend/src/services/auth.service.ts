import { AUTH_ENDPOINTS } from '@/constants/api';
import { api, apiRequest } from '@/services/api';
import type { ApiResponse } from '@/types/api.types';
import type { AuthSessionResponse, AuthUser } from '@/types/auth.types';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const authService = {
  register: (payload: RegisterPayload) =>
    apiRequest<AuthSessionResponse>(() =>
      api.post<ApiResponse<AuthSessionResponse>>(AUTH_ENDPOINTS.register, payload)
    ),

  login: (payload: LoginPayload) =>
    apiRequest<AuthSessionResponse>(() =>
      api.post<ApiResponse<AuthSessionResponse>>(AUTH_ENDPOINTS.login, payload)
    ),

  logout: () => apiRequest<null>(() => api.post<ApiResponse<null>>(AUTH_ENDPOINTS.logout)),

  logoutAll: () => apiRequest<null>(() => api.post<ApiResponse<null>>(AUTH_ENDPOINTS.logoutAll)),

  refresh: () =>
    apiRequest<{ expiresIn: string; expiresInSeconds: number }>(() =>
      api.post<ApiResponse<{ expiresIn: string; expiresInSeconds: number }>>(
        AUTH_ENDPOINTS.refresh
      )
    ),

  getMe: () => apiRequest<AuthUser>(() => api.get<ApiResponse<AuthUser>>(AUTH_ENDPOINTS.me)),

  changePassword: (payload: ChangePasswordPayload) =>
    apiRequest<null>(() => api.patch<ApiResponse<null>>(AUTH_ENDPOINTS.changePassword, payload)),
};
