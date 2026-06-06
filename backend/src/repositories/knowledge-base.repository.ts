import type { Prisma } from '@prisma/client';

import { prisma } from '../lib/prisma.js';

export type KnowledgeBaseRecord = Prisma.KnowledgeBaseGetPayload<object>;

export interface KnowledgeBaseListFilters {
  page: number;
  limit: number;
  skip: number;
  search?: string;
  category?: string;
  active?: boolean;
}

export class KnowledgeBaseRepository {
  async findMany(
    filters: KnowledgeBaseListFilters
  ): Promise<{ items: KnowledgeBaseRecord[]; total: number }> {
    const where: Prisma.KnowledgeBaseWhereInput = {};

    if (typeof filters.active === 'boolean') {
      where.active = filters.active;
    }

    if (filters.category) {
      where.category = filters.category;
    }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { content: { contains: filters.search, mode: 'insensitive' } },
        { category: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await prisma.$transaction([
      prisma.knowledgeBase.findMany({
        where,
        orderBy: [{ category: 'asc' }, { title: 'asc' }],
        skip: filters.skip,
        take: filters.limit,
      }),
      prisma.knowledgeBase.count({ where }),
    ]);

    return { items, total };
  }

  async findById(id: string): Promise<KnowledgeBaseRecord | null> {
    return prisma.knowledgeBase.findUnique({ where: { id } });
  }

  async create(data: Prisma.KnowledgeBaseCreateInput): Promise<KnowledgeBaseRecord> {
    return prisma.knowledgeBase.create({ data });
  }

  async update(id: string, data: Prisma.KnowledgeBaseUpdateInput): Promise<KnowledgeBaseRecord> {
    return prisma.knowledgeBase.update({ where: { id }, data });
  }

  async delete(id: string): Promise<KnowledgeBaseRecord> {
    return prisma.knowledgeBase.delete({ where: { id } });
  }

  async listCategories(): Promise<string[]> {
    const rows = await prisma.knowledgeBase.findMany({
      distinct: ['category'],
      select: { category: true },
      orderBy: { category: 'asc' },
    });

    return rows.map((row) => row.category);
  }
}

export const knowledgeBaseRepository = new KnowledgeBaseRepository();
