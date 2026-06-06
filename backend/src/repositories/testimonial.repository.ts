import type { Prisma } from '@prisma/client';

import { prisma } from '../lib/prisma.js';

export type TestimonialRecord = Prisma.TestimonialGetPayload<object>;

export interface TestimonialListFilters {
  page: number;
  limit: number;
  skip: number;
  search?: string;
  featured?: boolean;
}

export class TestimonialRepository {
  async findMany(
    filters: TestimonialListFilters
  ): Promise<{ items: TestimonialRecord[]; total: number }> {
    const where: Prisma.TestimonialWhereInput = {};

    if (typeof filters.featured === 'boolean') {
      where.featured = filters.featured;
    }

    if (filters.search) {
      where.OR = [
        { clientName: { contains: filters.search, mode: 'insensitive' } },
        { company: { contains: filters.search, mode: 'insensitive' } },
        { content: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await prisma.$transaction([
      prisma.testimonial.findMany({
        where,
        orderBy: [{ featured: 'desc' }, { updatedAt: 'desc' }],
        skip: filters.skip,
        take: filters.limit,
      }),
      prisma.testimonial.count({ where }),
    ]);

    return { items, total };
  }

  async findById(id: string): Promise<TestimonialRecord | null> {
    return prisma.testimonial.findUnique({ where: { id } });
  }

  async create(data: Prisma.TestimonialCreateInput): Promise<TestimonialRecord> {
    return prisma.testimonial.create({ data });
  }

  async update(id: string, data: Prisma.TestimonialUpdateInput): Promise<TestimonialRecord> {
    return prisma.testimonial.update({ where: { id }, data });
  }

  async delete(id: string): Promise<TestimonialRecord> {
    return prisma.testimonial.delete({ where: { id } });
  }
}

export const testimonialRepository = new TestimonialRepository();
