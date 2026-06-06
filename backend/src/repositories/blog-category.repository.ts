import type { BlogCategory, Prisma } from '@prisma/client';

import { prisma } from '../lib/prisma.js';

export type BlogCategoryWithCount = BlogCategory & { _count: { posts: number } };

export class BlogCategoryRepository {
  async findMany(): Promise<BlogCategoryWithCount[]> {
    return prisma.blogCategory.findMany({
      include: { _count: { select: { posts: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string): Promise<BlogCategory | null> {
    return prisma.blogCategory.findUnique({ where: { id } });
  }

  async slugExists(slug: string, excludeId?: string): Promise<boolean> {
    const count = await prisma.blogCategory.count({
      where: { slug, ...(excludeId ? { id: { not: excludeId } } : {}) },
    });
    return count > 0;
  }

  async create(data: Prisma.BlogCategoryCreateInput): Promise<BlogCategory> {
    return prisma.blogCategory.create({ data });
  }

  async update(id: string, data: Prisma.BlogCategoryUpdateInput): Promise<BlogCategory> {
    return prisma.blogCategory.update({ where: { id }, data });
  }

  async delete(id: string): Promise<BlogCategory> {
    return prisma.blogCategory.delete({ where: { id } });
  }
}

export const blogCategoryRepository = new BlogCategoryRepository();
