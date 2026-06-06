import type { LucideIcon } from 'lucide-react';

import type { Permission } from '@/constants/permissions';
import type { UserRole } from '@/types/auth.types';

export interface AdminNavItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  /** Required permissions — user must have all (default) or any based on requireAllPermissions */
  permissions?: Permission | Permission[];
  requireAllPermissions?: boolean;
  /** Required roles — alternative to permissions */
  roles?: UserRole | UserRole[];
  badge?: string;
  disabled?: boolean;
}

export interface AdminNavSection {
  id: string;
  title?: string;
  items: AdminNavItem[];
}

export interface AdminBreadcrumb {
  label: string;
  href?: string;
}

export interface AdminModuleMeta {
  id: string;
  title: string;
  description: string;
  permissions: Permission | Permission[];
}
