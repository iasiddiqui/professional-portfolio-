import type { NextFunction, Request, Response } from 'express';

function sanitizeString(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function sanitizeValue(value: unknown): unknown {
  if (typeof value === 'string') {
    return sanitizeString(value);
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, val]) => [key, sanitizeValue(val)])
    );
  }

  return value;
}

function sanitizeInPlace(target: Record<string, unknown>): void {
  for (const [key, value] of Object.entries(target)) {
    if (typeof value === 'string') {
      target[key] = sanitizeString(value);
      continue;
    }

    if (Array.isArray(value)) {
      target[key] = value.map((item) => sanitizeValue(item));
      continue;
    }

    if (value !== null && typeof value === 'object') {
      sanitizeInPlace(value as Record<string, unknown>);
    }
  }
}

export function sanitizeRequest(req: Request, _res: Response, next: NextFunction): void {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeValue(req.body);
  }

  // Express 5 exposes query/params as read-only getters — mutate in place.
  if (req.query && typeof req.query === 'object') {
    sanitizeInPlace(req.query as Record<string, unknown>);
  }

  if (req.params && typeof req.params === 'object') {
    sanitizeInPlace(req.params as Record<string, unknown>);
  }

  next();
}
