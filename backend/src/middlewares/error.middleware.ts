import type { NextFunction, Request, Response } from 'express';

import { env } from '../config/env.js';
import { HTTP_STATUS } from '../constants/http-status.js';
import { AppError } from '../utils/app-error.js';
import { formatErrorResponse, formatValidationErrors } from '../utils/error-formatter.js';
import { logger } from '../utils/logger.js';
import { isZodError } from '../utils/validate-schema.js';

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    if (!err.isOperational) {
      logger.error(err.message, { stack: err.stack, path: req.originalUrl });
    }

    res.status(err.statusCode).json(formatErrorResponse(err.message, err.errors));
    return;
  }

  if (isZodError(err)) {
    res
      .status(HTTP_STATUS.UNPROCESSABLE_ENTITY)
      .json(formatErrorResponse('Validation failed', formatValidationErrors(err.errors)));
    return;
  }

  if (err instanceof SyntaxError && 'body' in err) {
    res.status(HTTP_STATUS.BAD_REQUEST).json(formatErrorResponse('Invalid JSON payload'));
    return;
  }

  const message = err instanceof Error ? err.message : 'Internal server error';
  const stack = err instanceof Error ? err.stack : undefined;

  logger.error(message, {
    stack,
    path: req.originalUrl,
    method: req.method,
  });

  res
    .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
    .json(
      formatErrorResponse(
        env.NODE_ENV === 'production' ? 'Internal server error' : message
      )
    );
}
