import { RoleName } from '@prisma/client';
import type { Request } from 'express';

import { env } from '../../config/env.js';
import { HTTP_STATUS } from '../../constants/http-status.js';
import {
  mapUserWithPermissions,
  roleRepository,
  userRepository,
} from '../../repositories/index.js';
import type { AuthTokens, LoginResponse } from '../../types/auth.types.js';
import { getClientMeta, toSafeUserFromRecord } from '../../utils/auth.helpers.js';
import { AppError } from '../../utils/app-error.js';
import { extractRefreshToken } from '../../utils/cookies.js';
import { generateSessionId, generateTokenFamilyId, hashToken } from '../../utils/hash-token.js';
import { comparePassword, hashPassword } from '../../utils/password.js';
import {
  generateAccessToken,
  generateRefreshToken,
  getAccessTokenExpiresInSeconds,
  getRefreshTokenExpiresAt,
  getSessionExpiresAt,
  verifyRefreshToken,
} from '../../utils/token.js';
import type { ChangePasswordInput, LoginInput, RegisterInput } from './auth.validator.js';
import { authRepository } from './auth.repository.js';

export class AuthService {
  private async issueTokens(
    user: ReturnType<typeof mapUserWithPermissions>,
    sessionId: string,
    familyId: string,
    oldRefreshToken?: string
  ): Promise<AuthTokens> {
    const accessToken = generateAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role.name,
      permissions: user.permissions,
      sessionId,
    });

    const refreshToken = generateRefreshToken({
      sub: user.id,
      familyId,
      sessionId,
    });

    const expiresAt = getRefreshTokenExpiresAt();

    if (oldRefreshToken) {
      await authRepository.rotateRefreshToken(oldRefreshToken, refreshToken, {
        userId: user.id,
        familyId,
        expiresAt,
      });
    } else {
      await authRepository.createRefreshToken({
        userId: user.id,
        token: refreshToken,
        familyId,
        expiresAt,
      });
    }

    return {
      accessToken,
      refreshToken,
      expiresIn: env.JWT_EXPIRES_IN,
    };
  }

  private async createUserSession(userId: string, sessionId: string, req: Request): Promise<void> {
    const { userAgent, ipAddress } = getClientMeta(req);

    await authRepository.createSession({
      userId,
      tokenHash: hashToken(sessionId),
      userAgent,
      ipAddress,
      expiresAt: getSessionExpiresAt(),
    });
  }

  async register(
    input: RegisterInput,
    req: Request
  ): Promise<LoginResponse & { refreshToken: string }> {
    if (await authRepository.emailExists(input.email)) {
      throw new AppError('Email is already registered', HTTP_STATUS.CONFLICT);
    }

    const userRole = await roleRepository.findByName(RoleName.USER);

    if (!userRole) {
      throw new AppError('Default user role not configured. Run db:seed first.', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }

    const hashedPassword = await hashPassword(input.password);
    const sessionId = generateSessionId();
    const familyId = generateTokenFamilyId();

    const user = await userRepository.create({
      name: input.name.trim(),
      email: input.email.toLowerCase(),
      password: hashedPassword,
      role: { connect: { id: userRole.id } },
    });

    const mappedUser = mapUserWithPermissions(user);
    await this.createUserSession(user.id, sessionId, req);
    const tokens = await this.issueTokens(mappedUser, sessionId, familyId);

    return {
      user: toSafeUserFromRecord(user),
      accessToken: tokens.accessToken,
      expiresIn: tokens.expiresIn,
      refreshToken: tokens.refreshToken,
    };
  }

  async login(input: LoginInput, req: Request): Promise<LoginResponse & { refreshToken: string }> {
    const user = await userRepository.findByEmail(input.email);

    if (!user) {
      throw new AppError('Invalid email or password', HTTP_STATUS.UNAUTHORIZED);
    }

    if (!user.isActive) {
      throw new AppError('Account is deactivated', HTTP_STATUS.FORBIDDEN);
    }

    const isValidPassword = await comparePassword(input.password, user.password);

    if (!isValidPassword) {
      throw new AppError('Invalid email or password', HTTP_STATUS.UNAUTHORIZED);
    }

    const sessionId = generateSessionId();
    const familyId = generateTokenFamilyId();
    const mappedUser = mapUserWithPermissions(user);

    await this.createUserSession(user.id, sessionId, req);
    const tokens = await this.issueTokens(mappedUser, sessionId, familyId);

    return {
      user: toSafeUserFromRecord(user),
      accessToken: tokens.accessToken,
      expiresIn: tokens.expiresIn,
      refreshToken: tokens.refreshToken,
    };
  }

  async refreshToken(
    req: Request
  ): Promise<{ accessToken: string; expiresIn: string; refreshToken: string }> {
    const token = extractRefreshToken(req, req.body);

    if (!token) {
      throw new AppError('Refresh token is required', HTTP_STATUS.UNAUTHORIZED);
    }

    let payload;

    try {
      payload = verifyRefreshToken(token);
    } catch {
      throw new AppError('Invalid or expired refresh token', HTTP_STATUS.UNAUTHORIZED);
    }

    const storedToken = await authRepository.findValidRefreshToken(token);

    if (!storedToken) {
      const revokedToken = await authRepository.findRefreshTokenByHash(token);

      if (revokedToken) {
        await authRepository.revokeRefreshTokenFamily(revokedToken.familyId);
        throw new AppError('Refresh token reuse detected', HTTP_STATUS.UNAUTHORIZED);
      }

      await authRepository.revokeRefreshTokenFamily(payload.familyId);
      throw new AppError('Invalid refresh token', HTTP_STATUS.UNAUTHORIZED);
    }

    if (storedToken.userId !== payload.sub || storedToken.familyId !== payload.familyId) {
      await authRepository.revokeRefreshTokenFamily(storedToken.familyId);
      throw new AppError('Invalid refresh token', HTTP_STATUS.UNAUTHORIZED);
    }

    if (!storedToken.user.isActive) {
      throw new AppError('Account is deactivated', HTTP_STATUS.FORBIDDEN);
    }

    const session = await authRepository.findValidSessionByHash(hashToken(payload.sessionId));

    if (!session) {
      await authRepository.revokeRefreshTokenFamily(storedToken.familyId);
      throw new AppError('Session expired', HTTP_STATUS.UNAUTHORIZED);
    }

    const mappedUser = mapUserWithPermissions(storedToken.user);
    const tokens = await this.issueTokens(
      mappedUser,
      payload.sessionId,
      payload.familyId,
      token
    );

    return {
      accessToken: tokens.accessToken,
      expiresIn: tokens.expiresIn,
      refreshToken: tokens.refreshToken,
    };
  }

  async logout(req: Request): Promise<void> {
    const token = extractRefreshToken(req, req.body);

    if (token) {
      const storedToken = await authRepository.findRefreshTokenByHash(token);

      if (storedToken) {
        await authRepository.revokeRefreshTokenFamily(storedToken.familyId);
      }
    }

    if (req.user?.sessionId) {
      const session = await authRepository.findSessionByHash(hashToken(req.user.sessionId));

      if (session) {
        await authRepository.deleteSession(session.id);
      }
    }
  }

  async logoutAllSessions(userId: string): Promise<void> {
    await authRepository.revokeAllUserRefreshTokens(userId);
    await authRepository.deleteAllUserSessions(userId);
  }

  async getMe(userId: string) {
    const user = await userRepository.findActiveById(userId);

    if (!user) {
      throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
    }

    return toSafeUserFromRecord(user);
  }

  async changePassword(userId: string, input: ChangePasswordInput): Promise<void> {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
    }

    const isValidPassword = await comparePassword(input.currentPassword, user.password);

    if (!isValidPassword) {
      throw new AppError('Current password is incorrect', HTTP_STATUS.BAD_REQUEST);
    }

    if (input.currentPassword === input.newPassword) {
      throw new AppError('New password must be different from current password', HTTP_STATUS.BAD_REQUEST);
    }

    const hashedPassword = await hashPassword(input.newPassword);
    await userRepository.updatePassword(userId, hashedPassword);
    await authRepository.revokeAllUserRefreshTokens(userId);
    await authRepository.deleteAllUserSessions(userId);
  }
}

export const authService = new AuthService();

export { getAccessTokenExpiresInSeconds };
