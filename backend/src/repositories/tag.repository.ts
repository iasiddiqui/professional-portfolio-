import type { Prisma, Tag } from '@prisma/client';

import { prisma } from '../lib/prisma.js';

export type TagWithCounts = Tag & {
  _count: { blogPosts: number; projects: number };
};

export class TagRepository {
  async findMany(): Promise<TagWithCounts[]> {
    return prisma.tag.findMany({
      include: { _count: { select: { blogPosts: true, projects: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string): Promise<Tag | null> {
    return prisma.tag.findUnique({ where: { id } });
  }

  async findManyByIds(ids: string[]): Promise<Tag[]> {
    if (ids.length === 0) return [];
    return prisma.tag.findMany({ where: { id: { in: ids } } });
  }

  async slugExists(slug: string, excludeId?: string): Promise<boolean> {
    const count = await prisma.tag.count({
      where: { slug, ...(excludeId ? { id: { not: excludeId } } : {}) },
    });
    return count > 0;
  }

  async create(data: Prisma.TagCreateInput): Promise<Tag> {
    return prisma.tag.create({ data });
  }

  async update(id: string, data: Prisma.TagUpdateInput): Promise<Tag> {
    return prisma.tag.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Tag> {
    return prisma.tag.delete({ where: { id } });
  }
}

export const tagRepository = new TagRepository();
