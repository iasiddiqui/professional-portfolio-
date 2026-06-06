import type { ApiErrorDetail, ApiErrorResponse } from '../types/api.types.js';

export function formatErrorResponse(
  message: string,
  errors?: ApiErrorDetail[]
): ApiErrorResponse {
  return {
    success: false,
    message,
    ...(errors?.length ? { errors } : {}),
  };
}

export function formatValidationErrors(
  issues: { path: (string | number)[]; message: string }[]
): ApiErrorDetail[] {
  return issues.map((issue) => ({
    field: issue.path.join('.') || undefined,
    message: issue.message,
  }));
}
