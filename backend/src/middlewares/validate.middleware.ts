import type { NextFunction, Request, Response } from 'express';
import { ZodError, type ZodType } from 'zod';

import { AppError } from '../utils/app-error.js';
import { formatValidationErrors } from '../utils/error-formatter.js';
import { HTTP_STATUS } from '../constants/http-status.js';

type RequestProperty = 'body' | 'query' | 'params';

export function validate(schema: ZodType, property: RequestProperty = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse(req[property]);

      if (property === 'body') {
        req.body = parsed;
      } else if (property === 'query') {
        // Express 5 query is read-only and stringifies values — keep coerced output separately.
        req.validatedQuery = parsed;
      } else {
        req.validatedParams = parsed;
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(
          new AppError(
            'Validation failed',
            HTTP_STATUS.UNPROCESSABLE_ENTITY,
            formatValidationErrors(error.errors)
          )
        );
        return;
      }

      next(error);
    }
  };
}

export function validateBody(schema: ZodType) {
  return validate(schema, 'body');
}

export function validateQuery(schema: ZodType) {
  return validate(schema, 'query');
}

export function validateParams(schema: ZodType) {
  return validate(schema, 'params');
}
