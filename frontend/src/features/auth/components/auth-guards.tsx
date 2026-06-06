'use client';

import { useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';

import { Loader } from '@/components/common/loader';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/features/auth/providers/auth-provider';
import type { UserRole } from '@/types/auth.types';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  fallback,
  redirectTo = ROUTES.login,
}: ProtectedRouteProps) {
  const { isAuthenticated, isInitialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isAuthenticated, isInitialized, redirectTo, router]);

  if (!isInitialized) {
    return fallback ?? <Loader fullScreen label="Loading session..." />;
  }

  if (!isAuthenticated) {
    return fallback ?? <Loader fullScreen label="Redirecting..." />;
  }

  return <>{children}</>;
}

interface RoleGuardProps {
  children: ReactNode;
  roles: UserRole | UserRole[];
  fallback?: ReactNode;
}

export function RoleGuard({ children, roles, fallback = null }: RoleGuardProps) {
  const { hasRole, isInitialized } = useAuth();

  if (!isInitialized) return <Loader />;

  if (!hasRole(roles)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

interface PermissionGuardProps {
  children: ReactNode;
  permissions: string | string[];
  requireAll?: boolean;
  fallback?: ReactNode;
}

export function PermissionGuard({
  children,
  permissions,
  requireAll = true,
  fallback = null,
}: PermissionGuardProps) {
  const { hasPermission, hasAnyPermission, isInitialized } = useAuth();

  if (!isInitialized) return <Loader />;

  const allowed = requireAll
    ? hasPermission(permissions)
    : hasAnyPermission(Array.isArray(permissions) ? permissions : [permissions]);

  if (!allowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

interface GuestRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

export function GuestRoute({ children, redirectTo = ROUTES.admin.dashboard }: GuestRouteProps) {
  const { isAuthenticated, isInitialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isAuthenticated, isInitialized, redirectTo, router]);

  if (!isInitialized) {
    return <Loader fullScreen label="Loading..." />;
  }

  if (isAuthenticated) {
    return <Loader fullScreen label="Redirecting..." />;
  }

  return <>{children}</>;
}
