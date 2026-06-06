'use client';

import type { ReactNode } from 'react';

import { ErrorState } from '@/components/common/error-state';
import { PermissionGuard } from '@/features/auth/components/auth-guards';
import type { Permission } from '@/constants/permissions';

interface ModuleRouteProps {
  children: ReactNode;
  permissions: Permission | Permission[];
  requireAll?: boolean;
  moduleName?: string;
}

export function ModuleRoute({
  children,
  permissions,
  requireAll = true,
  moduleName = 'this module',
}: ModuleRouteProps) {
  return (
    <PermissionGuard
      permissions={permissions}
      requireAll={requireAll}
      fallback={
        <ErrorState
          title="Access denied"
          message={`You do not have permission to access ${moduleName}.`}
        />
      }
    >
      {children}
    </PermissionGuard>
  );
}
