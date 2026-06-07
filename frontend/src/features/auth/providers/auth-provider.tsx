'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { ROUTES } from '@/constants/routes';
import { getErrorMessage, isRateLimitError, isUnauthorizedError } from '@/lib/errors';
import {
  authService,
  type ChangePasswordPayload,
  type LoginPayload,
  type RegisterPayload,
} from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import type { AuthUser, UserRole } from '@/types/auth.types';
import { hasAnyPermission, hasPermission, hasRole } from '@/utils/permissions';

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  logoutAllSessions: () => Promise<void>;
  refreshSession: () => Promise<void>;
  changePassword: (payload: ChangePasswordPayload) => Promise<void>;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  hasPermission: (permissions: string | string[]) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const { user, isInitialized, setUser, setInitialized, clearAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const refreshSession = useCallback(async () => {
    try {
      const me = await authService.getMe();
      setUser(me);
    } catch (error) {
      if (isRateLimitError(error)) {
        toast.error('Too many requests. Please wait a moment and refresh.');
        return;
      }

      if (isUnauthorizedError(error)) {
        clearAuth();
      }
    }
  }, [clearAuth, setUser]);

  useEffect(() => {
    let mounted = true;

    if (useAuthStore.getState().user) {
      setInitialized(true);
    }

    const init = async () => {
      await refreshSession();
      if (mounted) {
        setInitialized(true);
      }
    };

    void init();

    return () => {
      mounted = false;
    };
  }, [refreshSession, setInitialized]);

  const login = useCallback(
    async (payload: LoginPayload) => {
      setIsLoading(true);
      try {
        const data = await authService.login(payload);
        setUser(data.user);
        toast.success('Welcome back!');
        router.push(ROUTES.admin.dashboard);
      } catch (error) {
        toast.error(getErrorMessage(error, 'Login failed'));
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [router, setUser]
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      setIsLoading(true);
      try {
        const data = await authService.register(payload);
        setUser(data.user);
        toast.success('Account created successfully');
        router.push(ROUTES.admin.dashboard);
      } catch (error) {
        toast.error(getErrorMessage(error, 'Registration failed'));
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [router, setUser]
  );

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } catch {
      // Clear local state even if server logout fails
    } finally {
      clearAuth();
      setIsLoading(false);
      toast.success('Logged out');
      router.push(ROUTES.login);
    }
  }, [clearAuth, router]);

  const logoutAllSessions = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logoutAll();
      clearAuth();
      toast.success('Signed out of all devices');
      router.push(ROUTES.login);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to revoke sessions'));
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [clearAuth, router]);

  const changePassword = useCallback(
    async (payload: ChangePasswordPayload) => {
      setIsLoading(true);
      try {
        await authService.changePassword(payload);
        clearAuth();
        toast.success('Password changed. Please log in again.');
        router.push(ROUTES.login);
      } catch (error) {
        toast.error(getErrorMessage(error, 'Password change failed'));
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [clearAuth, router]
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      isInitialized,
      login,
      register,
      logout,
      logoutAllSessions,
      refreshSession,
      changePassword,
      hasRole: (roles) => (user ? hasRole(user.role, roles) : false),
      hasPermission: (permissions) =>
        user ? hasPermission(user.permissions, permissions) : false,
      hasAnyPermission: (permissions) =>
        user ? hasAnyPermission(user.permissions, permissions) : false,
    }),
    [
      user,
      isLoading,
      isInitialized,
      login,
      register,
      logout,
      logoutAllSessions,
      refreshSession,
      changePassword,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
