import type { Prisma } from '@prisma/client';

import { prisma } from '../lib/prisma.js';

export type ResumeRecord = Prisma.ResumeGetPayload<object>;

export interface ResumeListFilters {
  page: number;
  limit: number;
  skip: number;
  search?: string;
  isActive?: boolean;
}

export class ResumeRepository {
  async findMany(filters: ResumeListFilters): Promise<{ items: ResumeRecord[]; total: number }> {
    const where: Prisma.ResumeWhereInput = {};

    if (typeof filters.isActive === 'boolean') {
      where.isActive = filters.isActive;
    }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { version: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await prisma.$transaction([
      prisma.resume.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: filters.skip,
        take: filters.limit,
      }),
      prisma.resume.count({ where }),
    ]);

    return { items, total };
  }

  async findById(id: string): Promise<ResumeRecord | null> {
    return prisma.resume.findUnique({ where: { id } });
  }

  async findActive(): Promise<ResumeRecord | null> {
    return prisma.resume.findFirst({ where: { isActive: true } });
  }

  async create(data: Prisma.ResumeCreateInput): Promise<ResumeRecord> {
    return prisma.resume.create({ data });
  }

  async update(id: string, data: Prisma.ResumeUpdateInput): Promise<ResumeRecord> {
    return prisma.resume.update({ where: { id }, data });
  }

  async delete(id: string): Promise<ResumeRecord> {
    return prisma.resume.delete({ where: { id } });
  }

  async activate(id: string): Promise<ResumeRecord> {
    return prisma.$transaction(async (tx) => {
      await tx.resume.updateMany({ data: { isActive: false } });
      return tx.resume.update({ where: { id }, data: { isActive: true } });
    });
  }
}

export const resumeRepository = new ResumeRepository();
