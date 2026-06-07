import type { NextFunction, Request, Response } from 'express';
import multer from 'multer';

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

  if (err instanceof multer.MulterError) {
    const message =
      err.code === 'LIMIT_FILE_SIZE' ? 'File is too large' : err.message;

    res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json(formatErrorResponse(message));
    return;
  }

  if (err instanceof SyntaxError && 'body' in err) {
    res.status(HTTP_STATUS.BAD_REQUEST).json(formatErrorResponse('Invalid JSON payload'));
    return;
  }

  const message = err instanceof Error ? err.message : 'Internal server error';
  const stack = err instanceof Error ? err.stack : undefined;

  // Cloudinary SDK sometimes rejects with plain objects instead of Error instances.
  const cloudinaryMessage =
    err && typeof err === 'object' && err !== null && 'message' in err
      ? String((err as { message: unknown }).message)
      : null;

  const resolvedMessage =
    message === 'Internal server error' && cloudinaryMessage ? cloudinaryMessage : message;

  logger.error(resolvedMessage, {
    stack,
    path: req.originalUrl,
    method: req.method,
  });

  res
    .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
    .json(
      formatErrorResponse(
        env.NODE_ENV === 'production' ? 'Internal server error' : resolvedMessage
      )
    );
}
