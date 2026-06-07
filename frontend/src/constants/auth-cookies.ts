/** Must match backend AUTH cookie names (`backend/src/constants/auth.constants.ts`). */
export const AUTH_COOKIE_NAMES = {
  accessToken: 'access_token',
  refreshToken: 'refresh_token',
} as const;
