import { Router } from 'express';

import { env } from '../../config/env.js';
import { prisma } from '../../lib/prisma.js';
import { asyncHandler } from '../../utils/async-handler.js';
import { sendSuccess } from '../../utils/api-response.js';
import { AppError } from '../../utils/app-error.js';
import { HTTP_STATUS } from '../../constants/http-status.js';

const healthRouter = Router();

healthRouter.get(
  '/',
  asyncHandler(async (_req, res) => {
    sendSuccess(res, {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
    });
  })
);

healthRouter.get(
  '/ready',
  asyncHandler(async (_req, res) => {
    try {
      await prisma.$queryRaw`SELECT 1`;

      sendSuccess(res, {
        status: 'ready',
        timestamp: new Date().toISOString(),
        checks: { database: 'ok' },
      });
    } catch {
      throw new AppError('Service unavailable', HTTP_STATUS.SERVICE_UNAVAILABLE);
    }
  })
);

export { healthRouter };
