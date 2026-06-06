import type { Response } from 'express';

import { DEFAULT_LIMIT, DEFAULT_PAGE, MAX_LIMIT } from '../constants/api.constants.js';
import type {
  ApiErrorDetail,
  ApiErrorResponse,
  ApiSuccessResponse,
  PaginatedResponse,
  PaginationMeta,
} from '../types/api.types.js';
import { formatErrorResponse } from './error-formatter.js';

export function sendSuccess<T>(
  res: Response,
  data: T,
  options?: { status?: number; message?: string; meta?: Record<string, unknown> }
): Response<ApiSuccessResponse<T>> {
  const { status = 200, message, meta } = options ?? {};

  return res.status(status).json({
    success: true,
    ...(message ? { message } : {}),
    data,
    ...(meta ? { meta } : {}),
  });
}

export function sendError(
  res: Response,
  message: string,
  options?: { status?: number; errors?: ApiErrorDetail[] }
): Response<ApiErrorResponse> {
  const { status = 500, errors } = options ?? {};

  return res.status(status).json(formatErrorResponse(message, errors));
}

export function buildPaginationMeta(page: number, limit: number, total: number): PaginationMeta {
  const totalPages = Math.ceil(total / limit) || 1;

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}

export function sendPaginated<T>(
  res: Response,
  data: T[],
  pagination: PaginationMeta,
  options?: { status?: number; message?: string }
): Response<PaginatedResponse<T>> {
  const { status = 200, message } = options ?? {};

  return res.status(status).json({
    success: true,
    ...(message ? { message } : {}),
    data,
    meta: { pagination },
  });
}

export function parsePaginationQuery(query: {
  page?: unknown;
  limit?: unknown;
}): { page: number; limit: number; skip: number } {
  const page = Math.max(1, Number(query.page) || DEFAULT_PAGE);
  const limit = Math.min(MAX_LIMIT, Math.max(1, Number(query.limit) || DEFAULT_LIMIT));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}
