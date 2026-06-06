export const AUTH = {
  ACCESS_TOKEN_HEADER: 'authorization',
  ACCESS_TOKEN_COOKIE: 'access_token',
  REFRESH_TOKEN_COOKIE: 'refresh_token',
  BEARER_PREFIX: 'Bearer ',
} as const;

export const BCRYPT_ROUNDS = 12;

export const TOKEN_TYPE = {
  ACCESS: 'access',
  REFRESH: 'refresh',
} as const;
