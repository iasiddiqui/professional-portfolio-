export type UserRole = 'ADMIN' | 'EDITOR' | 'USER';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: UserRole;
  permissions: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SessionRefreshResponse {
  expiresIn: string;
  expiresInSeconds: number;
}

export interface AuthSessionResponse {
  user: AuthUser;
  expiresIn: string;
  expiresInSeconds: number;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
}
