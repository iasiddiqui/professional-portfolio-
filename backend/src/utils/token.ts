import jwt, { type SignOptions } from 'jsonwebtoken';

import { env } from '../config/env.js';
import { TOKEN_TYPE } from '../constants/auth.constants.js';
import type { AccessTokenPayload, RefreshTokenPayload } from '../types/auth.types.js';
import { AppError } from './app-error.js';
import { HTTP_STATUS } from '../constants/http-status.js';

function parseDurationToSeconds(duration: string): number {
  const match = /^(\d+)([smhd])$/.exec(duration);

  if (!match) {
    return 7 * 24 * 60 * 60;
  }

  const value = Number(match[1]);
  const unit = match[2];

  switch (unit) {
    case 's':
      return value;
    case 'm':
      return value * 60;
    case 'h':
      return value * 60 * 60;
    case 'd':
      return value * 24 * 60 * 60;
    default:
      return 7 * 24 * 60 * 60;
  }
}

export function generateAccessToken(payload: Omit<AccessTokenPayload, 'type'>): string {
  return jwt.sign({ ...payload, type: TOKEN_TYPE.ACCESS }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
  });
}

export function generateRefreshToken(payload: Omit<RefreshTokenPayload, 'type'>): string {
  return jwt.sign({ ...payload, type: TOKEN_TYPE.REFRESH }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions['expiresIn'],
  });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as AccessTokenPayload;

    if (payload.type !== TOKEN_TYPE.ACCESS) {
      throw new AppError('Invalid access token', HTTP_STATUS.UNAUTHORIZED);
    }

    return payload;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError('Invalid or expired access token', HTTP_STATUS.UNAUTHORIZED);
  }
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  try {
    const payload = jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;

    if (payload.type !== TOKEN_TYPE.REFRESH) {
      throw new AppError('Invalid refresh token', HTTP_STATUS.UNAUTHORIZED);
    }

    return payload;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError('Invalid or expired refresh token', HTTP_STATUS.UNAUTHORIZED);
  }
}

export function getAccessTokenExpiresInSeconds(): number {
  return parseDurationToSeconds(env.JWT_EXPIRES_IN);
}

export function getRefreshTokenExpiresAt(): Date {
  const seconds = parseDurationToSeconds(env.JWT_REFRESH_EXPIRES_IN);
  return new Date(Date.now() + seconds * 1000);
}

export function getSessionExpiresAt(): Date {
  return getRefreshTokenExpiresAt();
}
