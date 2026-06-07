import { AnalyticsEventType, type Prisma } from '@prisma/client';

import { prisma } from '../lib/prisma.js';

export class AnalyticsRepository {
  async create(data: Prisma.AnalyticsCreateInput) {
    return prisma.analytics.create({ data });
  }

  async countByType(type: AnalyticsEventType) {
    return prisma.analytics.count({ where: { type } });
  }

  async countByTypeSince(type: AnalyticsEventType, since: Date) {
    return prisma.analytics.count({
      where: { type, createdAt: { gte: since } },
    });
  }

  async topPathsSince(since: Date, limit = 10) {
    const rows = await prisma.analytics.groupBy({
      by: ['path'],
      where: {
        type: AnalyticsEventType.PAGE_VIEW,
        path: { not: null },
        createdAt: { gte: since },
      },
      _count: { path: true },
      orderBy: { _count: { path: 'desc' } },
      take: limit,
    });

    return rows
      .filter((row): row is typeof row & { path: string } => Boolean(row.path))
      .map((row) => ({ path: row.path, count: row._count.path }));
  }
}

export const analyticsRepository = new AnalyticsRepository();
