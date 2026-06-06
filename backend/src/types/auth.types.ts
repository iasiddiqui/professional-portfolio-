import type { RoleName } from '@prisma/client';

export interface AccessTokenPayload {
  sub: string;
  email: string;
  role: RoleName;
  permissions: string[];
  sessionId: string;
  type: 'access';
}

export interface RefreshTokenPayload {
  sub: string;
  familyId: string;
  sessionId: string;
  type: 'refresh';
}

export interface AuthUser {
  id: string;
  email: string;
  role: RoleName;
  permissions: string[];
  sessionId: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface SafeUser {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: RoleName;
  permissions: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginResponse {
  user: SafeUser;
  accessToken: string;
  expiresIn: string;
}
