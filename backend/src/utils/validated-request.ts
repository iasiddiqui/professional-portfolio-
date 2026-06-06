import type { Request } from 'express';

export function getValidatedQuery<T>(req: Request): T {
  return (req.validatedQuery ?? req.query) as T;
}

export function getValidatedParams<T>(req: Request): T {
  return (req.validatedParams ?? req.params) as T;
}
