'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/constants/query-keys';
import {
  authService,
  type ChangePasswordPayload,
  type LoginPayload,
  type RegisterPayload,
} from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';

export function useMeQuery(enabled = true) {
  const user = useAuthStore((s) => s.user);
  const isInitialized = useAuthStore((s) => s.isInitialized);

  return useQuery({
    queryKey: QUERY_KEYS.auth.me,
    queryFn: () => authService.getMe(),
    enabled: enabled && isInitialized,
    initialData: user ?? undefined,
  });
}

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: (data) => {
      setUser(data.user);
      queryClient.setQueryData(QUERY_KEYS.auth.me, data.user);
    },
  });
}

export function useRegisterMutation() {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
    onSuccess: (data) => {
      setUser(data.user);
      queryClient.setQueryData(QUERY_KEYS.auth.me, data.user);
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  const { clearAuth } = useAuthStore();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      clearAuth();
      queryClient.removeQueries({ queryKey: QUERY_KEYS.auth.me });
    },
  });
}

export function useChangePasswordMutation() {
  const queryClient = useQueryClient();
  const { clearAuth } = useAuthStore();

  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => authService.changePassword(payload),
    onSuccess: () => {
      clearAuth();
      queryClient.removeQueries({ queryKey: QUERY_KEYS.auth.me });
    },
  });
}
