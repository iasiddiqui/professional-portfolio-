import type { NextFunction, Request, Response } from 'express';

import { env } from '../config/env.js';
import { HTTP_STATUS } from '../constants/http-status.js';
import { AppError } from '../utils/app-error.js';

export function requirePublicRegistration(
  _req: Request,
  _res: Response,
  next: NextFunction
): void {
  if (!env.ALLOW_PUBLIC_REGISTRATION) {
    next(new AppError('Registration is disabled', HTTP_STATUS.FORBIDDEN));
    return;
  }

  next();
}
