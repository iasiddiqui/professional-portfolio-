import type { CookieOptions, Request, Response } from 'express';

import { env } from '../config/env.js';
import { AUTH } from '../constants/auth.constants.js';
import { getAccessTokenExpiresInSeconds, getRefreshTokenExpiresAt } from './token.js';

function getCookiePath(): string {
  return env.AUTH_COOKIE_PATH;
}

function getBaseCookieOptions(maxAgeMs: number): CookieOptions {
  return {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: env.COOKIE_SAME_SITE,
    maxAge: Math.max(maxAgeMs, 0),
    path: getCookiePath(),
  };
}

export function getAccessTokenCookieOptions(): CookieOptions {
  return getBaseCookieOptions(getAccessTokenExpiresInSeconds() * 1000);
}

export function getRefreshTokenCookieOptions(): CookieOptions {
  return getBaseCookieOptions(getRefreshTokenExpiresAt().getTime() - Date.now());
}

export function getClearCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: env.COOKIE_SAME_SITE,
    path: getCookiePath(),
  };
}

export function setAccessTokenCookie(res: Response, accessToken: string): void {
  res.cookie(AUTH.ACCESS_TOKEN_COOKIE, accessToken, getAccessTokenCookieOptions());
}

export function setRefreshTokenCookie(res: Response, refreshToken: string): void {
  res.cookie(AUTH.REFRESH_TOKEN_COOKIE, refreshToken, getRefreshTokenCookieOptions());
}

export function setAuthCookies(
  res: Response,
  accessToken: string,
  refreshToken: string
): void {
  setAccessTokenCookie(res, accessToken);
  setRefreshTokenCookie(res, refreshToken);
}

export function clearAccessTokenCookie(res: Response): void {
  res.clearCookie(AUTH.ACCESS_TOKEN_COOKIE, getClearCookieOptions());
}

export function clearRefreshTokenCookie(res: Response): void {
  res.clearCookie(AUTH.REFRESH_TOKEN_COOKIE, getClearCookieOptions());
}

export function clearAuthCookies(res: Response): void {
  clearAccessTokenCookie(res);
  clearRefreshTokenCookie(res);
}

export function extractAccessToken(req: Request): string | undefined {
  const cookieToken = req.cookies?.[AUTH.ACCESS_TOKEN_COOKIE] as string | undefined;

  if (cookieToken) {
    return cookieToken;
  }

  const header = req.headers[AUTH.ACCESS_TOKEN_HEADER];

  if (!header || typeof header !== 'string') {
    return undefined;
  }

  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return undefined;
  }

  return token;
}

export function extractRefreshToken(
  req: Request,
  body?: { refreshToken?: string }
): string | undefined {
  const cookieToken = req.cookies?.[AUTH.REFRESH_TOKEN_COOKIE] as string | undefined;

  if (cookieToken) {
    return cookieToken;
  }

  return body?.refreshToken;
}
