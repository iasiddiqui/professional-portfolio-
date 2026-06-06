import crypto from 'node:crypto';

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function generateTokenFamilyId(): string {
  return crypto.randomUUID();
}

export function generateSessionId(): string {
  return crypto.randomUUID();
}
