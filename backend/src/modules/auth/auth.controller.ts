import type { Request, Response } from 'express';

import { HTTP_STATUS } from '../../constants/http-status.js';
import { asyncHandler } from '../../utils/async-handler.js';
import { sendSuccess } from '../../utils/api-response.js';
import { clearAuthCookies, setAuthCookies } from '../../utils/cookies.js';
import { getAccessTokenExpiresInSeconds } from './auth.service.js';
import { authService } from './auth.service.js';
import type { ChangePasswordInput, LoginInput, RegisterInput } from './auth.validator.js';

function sendAuthSuccess(
  res: Response,
  user: Awaited<ReturnType<typeof authService.getMe>>,
  tokens: { accessToken: string; refreshToken: string; expiresIn: string },
  options?: { status?: number; message?: string }
): void {
  setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

  sendSuccess(
    res,
    {
      user,
      expiresIn: tokens.expiresIn,
      expiresInSeconds: getAccessTokenExpiresInSeconds(),
    },
    options
  );
}

export class AuthController {
  register = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.register(req.body as RegisterInput, req);

    sendAuthSuccess(
      res,
      result.user,
      {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        expiresIn: result.expiresIn,
      },
      { status: HTTP_STATUS.CREATED, message: 'Registration successful' }
    );
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.login(req.body as LoginInput, req);

    sendAuthSuccess(
      res,
      result.user,
      {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        expiresIn: result.expiresIn,
      },
      { message: 'Login successful' }
    );
  });

  refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.refreshToken(req);

    setAuthCookies(res, result.accessToken, result.refreshToken);

    sendSuccess(
      res,
      {
        expiresIn: result.expiresIn,
        expiresInSeconds: getAccessTokenExpiresInSeconds(),
      },
      { message: 'Token refreshed successfully' }
    );
  });

  logout = asyncHandler(async (req: Request, res: Response) => {
    await authService.logout(req);
    clearAuthCookies(res);

    sendSuccess(res, null, { message: 'Logout successful' });
  });

  logoutAllSessions = asyncHandler(async (req: Request, res: Response) => {
    await authService.logoutAllSessions(req.user!.id);
    clearAuthCookies(res);

    sendSuccess(res, null, { message: 'All sessions revoked successfully' });
  });

  getMe = asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.getMe(req.user!.id);
    sendSuccess(res, user);
  });

  changePassword = asyncHandler(async (req: Request, res: Response) => {
    await authService.changePassword(req.user!.id, req.body as ChangePasswordInput);
    clearAuthCookies(res);

    sendSuccess(res, null, {
      message: 'Password changed successfully. Please log in again.',
    });
  });
}

export const authController = new AuthController();
