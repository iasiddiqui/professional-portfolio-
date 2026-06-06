import type { AiFeatureType, Prisma } from '@prisma/client';

import { prisma } from '../lib/prisma.js';

export class KnowledgeBaseRepository {
  async findAllActive() {
    return prisma.knowledgeBase.findMany({
      where: { active: true },
      orderBy: [{ category: 'asc' }, { title: 'asc' }],
    });
  }

  async findByCategories(categories: string[]) {
    return prisma.knowledgeBase.findMany({
      where: { active: true, category: { in: categories } },
      orderBy: [{ category: 'asc' }, { title: 'asc' }],
    });
  }
}

export class AiInteractionRepository {
  async create(data: Prisma.AiInteractionCreateInput) {
    return prisma.aiInteraction.create({ data });
  }

  async findRecentBySession(sessionId: string, feature: AiFeatureType, limit = 6) {
    return prisma.aiInteraction.findMany({
      where: { sessionId, feature },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async findMany(filters: {
    page: number;
    limit: number;
    skip: number;
    feature?: AiFeatureType;
  }) {
    const where: Prisma.AiInteractionWhereInput = filters.feature
      ? { feature: filters.feature }
      : {};

    const [items, total] = await prisma.$transaction([
      prisma.aiInteraction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: filters.skip,
        take: filters.limit,
      }),
      prisma.aiInteraction.count({ where }),
    ]);

    return { items, total };
  }
}

export const knowledgeBaseRepository = new KnowledgeBaseRepository();
export const aiInteractionRepository = new AiInteractionRepository();
