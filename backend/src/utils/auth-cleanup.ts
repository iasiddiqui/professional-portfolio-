import { sessionRepository } from '../repositories/session.repository.js';
import { refreshTokenRepository } from '../repositories/refresh-token.repository.js';
import { logger } from './logger.js';

export async function cleanupExpiredAuthRecords(): Promise<void> {
  try {
    const [sessions, tokens] = await Promise.all([
      sessionRepository.deleteExpired(),
      refreshTokenRepository.deleteExpired(),
    ]);

    if (sessions > 0 || tokens > 0) {
      logger.info('Auth cleanup completed', { sessionsRemoved: sessions, tokensRemoved: tokens });
    }
  } catch (error) {
    logger.warn('Auth cleanup skipped', {
      reason: error instanceof Error ? error.message : String(error),
    });
  }
}
