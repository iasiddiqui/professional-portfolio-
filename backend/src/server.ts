import 'dotenv/config';

import { createApp } from './app.js';
import { env } from './config/env.js';
import { connectDatabase, disconnectDatabase } from './lib/prisma.js';
import { cleanupExpiredAuthRecords } from './utils/auth-cleanup.js';
import { logger } from './utils/logger.js';

const AUTH_CLEANUP_INTERVAL_MS = 60 * 60 * 1000;

async function bootstrap(): Promise<void> {
  await connectDatabase();
  logger.info('Database connected');

  const app = createApp();

  const server = app.listen(env.PORT, () => {
    logger.info('Server started', {
      port: env.PORT,
      apiPrefix: env.API_PREFIX,
      environment: env.NODE_ENV,
    });
  });

  void cleanupExpiredAuthRecords();
  const cleanupTimer = setInterval(() => {
    void cleanupExpiredAuthRecords();
  }, AUTH_CLEANUP_INTERVAL_MS);
  cleanupTimer.unref();

  const shutdown = async (signal: string) => {
    logger.info(`Received ${signal}, shutting down gracefully`);

    clearInterval(cleanupTimer);

    server.close(async () => {
      await disconnectDatabase();
      logger.info('Database disconnected');
      process.exit(0);
    });

    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10_000).unref();
  };

  process.on('SIGTERM', () => void shutdown('SIGTERM'));
  process.on('SIGINT', () => void shutdown('SIGINT'));
  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled promise rejection', {
      reason: reason instanceof Error ? reason.message : String(reason),
    });
  });
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught exception', {
      message: error.message,
      stack: error.stack,
    });
    void shutdown('uncaughtException');
  });
}

bootstrap().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'Unknown error';
  logger.error('Failed to start server', {
    message,
    stack: error instanceof Error ? error.stack : undefined,
  });
  process.exit(1);
});
