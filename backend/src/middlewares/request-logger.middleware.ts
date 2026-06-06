import type { NextFunction, Request, Response } from 'express';

import { env } from '../config/env.js';

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const log = `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`;

    if (env.NODE_ENV === 'development') {
      console.log(log);
    }
  });

  next();
}
