import type { Prisma } from '@prisma/client';

import { prisma } from '../lib/prisma.js';
import { hashToken } from '../utils/hash-token.js';

export class RefreshTokenRepository {
  async create(data: {
    userId: string;
    token: string;
    familyId: string;
    expiresAt: Date;
  }) {
    return prisma.refreshToken.create({
      data: {
        userId: data.userId,
        tokenHash: hashToken(data.token),
        familyId: data.familyId,
        expiresAt: data.expiresAt,
      },
    });
  }

  async findByToken(token: string) {
    return prisma.refreshToken.findUnique({
      where: { tokenHash: hashToken(token) },
      include: { user: { include: { role: true } } },
    });
  }

  async findValidByToken(token: string) {
    return prisma.refreshToken.findFirst({
      where: {
        tokenHash: hashToken(token),
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
      include: { user: { include: { role: true } } },
    });
  }

  async revokeToken(token: string): Promise<void> {
    await prisma.refreshToken.updateMany({
      where: { tokenHash: hashToken(token), revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  async revokeFamily(familyId: string): Promise<void> {
    await prisma.refreshToken.updateMany({
      where: { familyId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  async revokeAllForUser(userId: string): Promise<void> {
    await prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  async rotateToken(
    oldToken: string,
    newToken: string,
    data: { userId: string; familyId: string; expiresAt: Date }
  ) {
    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.refreshToken.updateMany({
        where: { tokenHash: hashToken(oldToken), revokedAt: null },
        data: { revokedAt: new Date() },
      });

      return tx.refreshToken.create({
        data: {
          userId: data.userId,
          tokenHash: hashToken(newToken),
          familyId: data.familyId,
          expiresAt: data.expiresAt,
        },
      });
    });
  }

  async deleteExpired(): Promise<number> {
    const result = await prisma.refreshToken.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: new Date() } },
          { revokedAt: { not: null, lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
        ],
      },
    });

    return result.count;
  }
}

export const refreshTokenRepository = new RefreshTokenRepository();
