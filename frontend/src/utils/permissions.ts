import type { UserRole } from '@/types/auth.types';

export function hasRole(userRole: UserRole, allowed: UserRole | UserRole[]): boolean {
  const list = Array.isArray(allowed) ? allowed : [allowed];
  return list.includes(userRole);
}

export function hasPermission(
  userPermissions: string[],
  required: string | string[]
): boolean {
  const list = Array.isArray(required) ? required : [required];
  return list.every((p) => userPermissions.includes(p));
}

export function hasAnyPermission(userPermissions: string[], required: string[]): boolean {
  return required.some((p) => userPermissions.includes(p));
}
