import type { ApiErrorResponse } from '@/types/api.types';

export function createApiError(
  message: string,
  status?: number,
  errors?: ApiErrorResponse['errors']
): Error & { status?: number; errors?: ApiErrorResponse['errors'] } {
  const error = new Error(message) as Error & {
    status?: number;
    errors?: ApiErrorResponse['errors'];
  };
  error.status = status;
  error.errors = errors;
  return error;
}

export function getErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return fallback;
}

export function isUnauthorizedError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    (error as { status?: number }).status === 401
  );
}
