import type { Prisma } from '@prisma/client';

import { prisma } from '../lib/prisma.js';

export type BlogPostWithRelations = Prisma.BlogPostGetPayload<{
  include: {
    category: { select: { id: true; name: true; slug: true } };
    tags: { include: { tag: true } };
    author: { select: { id: true; name: true; email: true } };
  };
}>;

export interface BlogListFilters {
  page: number;
  limit: number;
  skip: number;
  published?: boolean;
  categoryId?: string;
  tagId?: string;
  search?: string;
  lean?: boolean;
}

export class BlogRepository {
  private readonly include = {
    category: { select: { id: true, name: true, slug: true } },
    tags: { include: { tag: true } },
    author: { select: { id: true, name: true, email: true } },
  } satisfies Prisma.BlogPostInclude;

  async findMany(filters: BlogListFilters): Promise<{ items: BlogPostWithRelations[]; total: number }> {
    const where: Prisma.BlogPostWhereInput = {};

    if (typeof filters.published === 'boolean') {
      where.published = filters.published;
    }

    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters.tagId) {
      where.tags = { some: { tagId: filters.tagId } };
    }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { slug: { contains: filters.search, mode: 'insensitive' } },
        { excerpt: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = filters.lean
      ? await prisma.$transaction([
          prisma.blogPost.findMany({
            where,
            select: {
              id: true,
              title: true,
              slug: true,
              excerpt: true,
              featuredImage: true,
              published: true,
              publishedAt: true,
              readingTimeMinutes: true,
              seoTitle: true,
              seoDescription: true,
              createdAt: true,
              updatedAt: true,
              categoryId: true,
              authorId: true,
              category: { select: { id: true, name: true, slug: true } },
              tags: { include: { tag: true } },
              author: { select: { id: true, name: true, email: true } },
            },
            orderBy: [{ published: 'desc' }, { updatedAt: 'desc' }],
            skip: filters.skip,
            take: filters.limit,
          }),
          prisma.blogPost.count({ where }),
        ])
      : await prisma.$transaction([
          prisma.blogPost.findMany({
            where,
            include: this.include,
            orderBy: [{ published: 'desc' }, { updatedAt: 'desc' }],
            skip: filters.skip,
            take: filters.limit,
          }),
          prisma.blogPost.count({ where }),
        ]);

    return { items: items as BlogPostWithRelations[], total };
  }

  async findById(id: string): Promise<BlogPostWithRelations | null> {
    return prisma.blogPost.findUnique({ where: { id }, include: this.include });
  }

  async findBySlug(slug: string): Promise<BlogPostWithRelations | null> {
    return prisma.blogPost.findUnique({ where: { slug }, include: this.include });
  }

  async slugExists(slug: string, excludeId?: string): Promise<boolean> {
    const count = await prisma.blogPost.count({
      where: { slug, ...(excludeId ? { id: { not: excludeId } } : {}) },
    });
    return count > 0;
  }

  async create(data: Prisma.BlogPostCreateInput): Promise<BlogPostWithRelations> {
    return prisma.blogPost.create({ data, include: this.include });
  }

  async update(id: string, data: Prisma.BlogPostUpdateInput): Promise<BlogPostWithRelations> {
    return prisma.blogPost.update({ where: { id }, data, include: this.include });
  }

  async delete(id: string): Promise<BlogPostWithRelations> {
    return prisma.blogPost.delete({ where: { id }, include: this.include });
  }

  async syncTags(blogPostId: string, tagIds: string[]): Promise<void> {
    await prisma.$transaction([
      prisma.blogPostTag.deleteMany({ where: { blogPostId } }),
      ...(tagIds.length > 0
        ? [
            prisma.blogPostTag.createMany({
              data: tagIds.map((tagId) => ({ blogPostId, tagId })),
              skipDuplicates: true,
            }),
          ]
        : []),
    ]);
  }
}

export const blogRepository = new BlogRepository();
