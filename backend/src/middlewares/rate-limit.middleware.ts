import rateLimit from 'express-rate-limit';

import { env } from '../config/env.js';
import { HTTP_STATUS } from '../constants/http-status.js';
import { formatErrorResponse } from '../utils/error-formatter.js';

export const apiRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: formatErrorResponse('Too many requests, please try again later'),
  statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
});

export const aiRateLimiter = rateLimit({
  windowMs: env.AI_RATE_LIMIT_WINDOW_MS,
  max: env.AI_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: formatErrorResponse('Too many AI requests, please try again later'),
  statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
});

export const contactRateLimiter = rateLimit({
  windowMs: env.CONTACT_RATE_LIMIT_WINDOW_MS,
  max: env.CONTACT_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: formatErrorResponse('Too many contact submissions, please try again later'),
  statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
});

export const githubRateLimiter = rateLimit({
  windowMs: env.GITHUB_RATE_LIMIT_WINDOW_MS,
  max: env.GITHUB_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: formatErrorResponse('Too many GitHub requests, please try again later'),
  statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
});

export const authRateLimiter = rateLimit({
  windowMs: env.AUTH_RATE_LIMIT_WINDOW_MS,
  max: env.AUTH_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: formatErrorResponse('Too many authentication attempts, please try again later'),
  statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
});
