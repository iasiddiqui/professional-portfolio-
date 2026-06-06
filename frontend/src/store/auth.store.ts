import { create } from 'zustand';

import type { AuthUser } from '@/types/auth.types';

interface AuthStore {
  user: AuthUser | null;
  isInitialized: boolean;
  setUser: (user: AuthUser | null) => void;
  setInitialized: (value: boolean) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isInitialized: false,
  setUser: (user) => set({ user }),
  setInitialized: (isInitialized) => set({ isInitialized }),
  clearAuth: () => set({ user: null }),
}));

export const selectIsAuthenticated = (state: AuthStore) => Boolean(state.user);
