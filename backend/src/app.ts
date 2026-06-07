import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';

import { env } from './config/env.js';
import { healthRouter } from './modules/health/health.routes.js';
import {
  apiRateLimiter,
  errorHandler,
  notFoundHandler,
  sanitizeRequest,
} from './middlewares/index.js';
import { apiRouter } from './routes/index.js';
import { sendSuccess } from './utils/api-response.js';
import { getUploadDir } from './utils/upload.js';

export function createApp() {
  const app = express();

  app.set('trust proxy', 1);
  app.disable('x-powered-by');

  app.use(
    helmet({
      contentSecurityPolicy: env.NODE_ENV === 'production',
      crossOriginEmbedderPolicy: false,
      xssFilter: true,
    })
  );
  app.use(
    cors({
      origin: env.CORS_ORIGINS,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );
  app.use(compression());
  app.use(hpp());
  app.use(cookieParser());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(sanitizeRequest);

  if (env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  } else {
    app.use(morgan('combined'));
  }

  app.get('/', (_req, res) => {
    sendSuccess(res, {
      name: 'Portfolio API',
      version: 'v1',
      health: `${env.API_PREFIX}/health`,
      readiness: `${env.API_PREFIX}/health/ready`,
    });
  });

  app.use(`${env.API_PREFIX}/health`, healthRouter);

  app.use(
    '/uploads',
    express.static(getUploadDir(), {
      setHeaders(res, filePath) {
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('Content-Disposition', 'inline');
        res.setHeader('X-Frame-Options', 'SAMEORIGIN');

        if (filePath.endsWith('.pdf')) {
          res.setHeader('Content-Type', 'application/pdf');
        }
      },
    })
  );

  app.use(apiRateLimiter);
  app.use(apiRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
