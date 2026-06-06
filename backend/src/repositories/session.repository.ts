import { prisma } from '../lib/prisma.js';

export class SessionRepository {
  async create(data: {
    userId: string;
    tokenHash: string;
    userAgent?: string;
    ipAddress?: string;
    expiresAt: Date;
  }) {
    return prisma.session.create({ data });
  }

  async findByHash(tokenHash: string) {
    return prisma.session.findUnique({ where: { tokenHash } });
  }

  async findValidByHash(tokenHash: string) {
    return prisma.session.findFirst({
      where: {
        tokenHash,
        expiresAt: { gt: new Date() },
      },
    });
  }

  async touch(sessionId: string): Promise<void> {
    await prisma.session.update({
      where: { id: sessionId },
      data: { lastActiveAt: new Date() },
    }).catch(() => undefined);
  }

  async delete(sessionId: string): Promise<void> {
    await prisma.session.delete({ where: { id: sessionId } }).catch(() => undefined);
  }

  async deleteAllForUser(userId: string): Promise<void> {
    await prisma.session.deleteMany({ where: { userId } });
  }

  async deleteExpired(): Promise<number> {
    const result = await prisma.session.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });

    return result.count;
  }
}

export const sessionRepository = new SessionRepository();
