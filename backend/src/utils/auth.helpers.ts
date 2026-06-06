import type { Request } from 'express';

import type { SafeUser } from '../types/auth.types.js';
import { mapUserWithPermissions, type UserWithRole } from '../repositories/index.js';

export function toSafeUser(user: UserWithRole & { permissions: string[] }): SafeUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role.name,
    permissions: user.permissions,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export function toSafeUserFromRecord(user: UserWithRole): SafeUser {
  return toSafeUser(mapUserWithPermissions(user));
}

export function getClientMeta(req: Request) {
  return {
    userAgent: req.headers['user-agent'],
    ipAddress: req.ip,
  };
}
