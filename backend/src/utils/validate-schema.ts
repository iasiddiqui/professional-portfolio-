import { ZodError, type ZodType } from 'zod';

import { AppError } from './app-error.js';
import { formatValidationErrors } from './error-formatter.js';
import { HTTP_STATUS } from '../constants/http-status.js';

export function validateSchema<T extends ZodType>(schema: T, data: unknown): T['_output'] {
  return schema.parse(data);
}

export function safeValidateSchema<T extends ZodType>(schema: T, data: unknown) {
  return schema.safeParse(data);
}

export function validateSchemaOrThrow<T extends ZodType>(
  schema: T,
  data: unknown,
  message = 'Validation failed'
): T['_output'] {
  const result = schema.safeParse(data);

  if (!result.success) {
    throw new AppError(message, HTTP_STATUS.UNPROCESSABLE_ENTITY, formatValidationErrors(result.error.errors));
  }

  return result.data;
}

export function isZodError(error: unknown): error is ZodError {
  return error instanceof ZodError;
}
