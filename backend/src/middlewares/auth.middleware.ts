import type { NextFunction, Request, Response } from 'express';

import { HTTP_STATUS } from '../constants/http-status.js';
import { authRepository } from '../modules/auth/auth.repository.js';
import { parsePermissions } from '../repositories/index.js';
import type { AuthUser } from '../types/auth.types.js';
import { AppError } from '../utils/app-error.js';
import { extractAccessToken } from '../utils/cookies.js';
import { hashToken } from '../utils/hash-token.js';
import { verifyAccessToken } from '../utils/token.js';

const SESSION_TOUCH_INTERVAL_MS = 5 * 60 * 1000;

async function resolveAuthUser(token: string): Promise<AuthUser> {
  const payload = verifyAccessToken(token);

  const session = await authRepository.findValidSessionByHash(hashToken(payload.sessionId));

  if (!session) {
    throw new AppError('Session expired or invalid', HTTP_STATUS.UNAUTHORIZED);
  }

  const user = await authRepository.findActiveUserById(payload.sub);

  if (!user) {
    throw new AppError('Account not found or deactivated', HTTP_STATUS.UNAUTHORIZED);
  }

  const permissions = parsePermissions(user.role.permissions);

  const shouldTouchSession =
    Date.now() - session.lastActiveAt.getTime() >= SESSION_TOUCH_INTERVAL_MS;

  if (shouldTouchSession) {
    void authRepository.touchSession(session.id);
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role.name,
    permissions,
    sessionId: payload.sessionId,
  };
}

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  void (async () => {
    try {
      const token = extractAccessToken(req);

      if (!token) {
        throw new AppError('Authentication required', HTTP_STATUS.UNAUTHORIZED);
      }

      req.user = await resolveAuthUser(token);
      req.token = token;
      next();
    } catch (error) {
      next(error);
    }
  })();
}

export function optionalAuthenticate(req: Request, _res: Response, next: NextFunction): void {
  const token = extractAccessToken(req);

  if (!token) {
    next();
    return;
  }

  authenticate(req, _res, next);
}
