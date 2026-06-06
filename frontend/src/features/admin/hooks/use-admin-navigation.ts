'use client';

import { useMemo } from 'react';

import { adminNavigation } from '@/features/admin/config/admin-navigation';
import { useAuth } from '@/features/auth/providers/auth-provider';
import type { AdminNavItem, AdminNavSection } from '@/types/admin.types';
import type { UserRole } from '@/types/auth.types';

function canAccessItem(
  item: AdminNavItem,
  hasRole: (roles: UserRole | UserRole[]) => boolean,
  hasPermission: (permissions: string | string[]) => boolean,
  hasAnyPermission: (permissions: string[]) => boolean
): boolean {
  if (item.disabled) return false;

  if (item.roles && !hasRole(item.roles)) {
    return false;
  }

  if (item.permissions) {
    const perms = Array.isArray(item.permissions) ? item.permissions : [item.permissions];
    const allowed = item.requireAllPermissions === false
      ? hasAnyPermission(perms)
      : hasPermission(perms);
    if (!allowed) return false;
  }

  return true;
}

export function useAdminNavigation() {
  const { hasRole, hasPermission, hasAnyPermission } = useAuth();

  const sections = useMemo(() => {
    return adminNavigation
      .map((section) => ({
        ...section,
        items: section.items.filter((item) =>
          canAccessItem(item, hasRole, hasPermission, hasAnyPermission)
        ),
      }))
      .filter((section) => section.items.length > 0) satisfies AdminNavSection[];
  }, [hasRole, hasPermission, hasAnyPermission]);

  const flatItems = useMemo(() => sections.flatMap((section) => section.items), [sections]);

  return { sections, flatItems };
}
