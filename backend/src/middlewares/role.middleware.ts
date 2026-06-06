import type { RoleName } from '@prisma/client';
import type { NextFunction, Request, Response, RequestHandler } from 'express';

import {
  hasAnyPermission,
  hasPermission,
  hasRole,
  type Permission,
} from '../constants/permissions.js';
import { HTTP_STATUS } from '../constants/http-status.js';
import { AppError } from '../utils/app-error.js';
import { authenticate } from './auth.middleware.js';

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  if (!req.user) {
    next(new AppError('Authentication required', HTTP_STATUS.UNAUTHORIZED));
    return;
  }

  next();
}

export function requireRole(...roles: RoleName[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError('Authentication required', HTTP_STATUS.UNAUTHORIZED));
      return;
    }

    if (!hasRole(req.user.role, roles)) {
      next(new AppError('Insufficient role privileges', HTTP_STATUS.FORBIDDEN));
      return;
    }

    next();
  };
}

export function requirePermission(...permissions: Permission[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError('Authentication required', HTTP_STATUS.UNAUTHORIZED));
      return;
    }

    if (!hasPermission(req.user.permissions, permissions)) {
      next(new AppError('Insufficient permissions', HTTP_STATUS.FORBIDDEN));
      return;
    }

    next();
  };
}

export function requireAnyPermission(...permissions: Permission[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError('Authentication required', HTTP_STATUS.UNAUTHORIZED));
      return;
    }

    if (!hasAnyPermission(req.user.permissions, permissions)) {
      next(new AppError('Insufficient permissions', HTTP_STATUS.FORBIDDEN));
      return;
    }

    next();
  };
}

/** Compose authenticate + role guard into a single middleware chain. */
export function authorize(...roles: RoleName[]): RequestHandler[] {
  return [authenticate, requireRole(...roles)];
}

/** Compose full authenticate + permission guard. */
export function authorizePermission(...permissions: Permission[]): RequestHandler[] {
  return [authenticate, requirePermission(...permissions)];
}

/** Compose full authenticate + permission guard. */
export function authorizeStrict(...permissions: Permission[]): RequestHandler[] {
  return [authenticate, requirePermission(...permissions)];
}
