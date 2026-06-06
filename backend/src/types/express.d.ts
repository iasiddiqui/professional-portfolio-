import type { JwtPayload } from 'jsonwebtoken';

import type { AuthUser } from './auth.types.js';

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      token?: string;
    }
  }
}

export type { JwtPayload };
