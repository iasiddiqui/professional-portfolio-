import type { Prisma, Project, ProjectStatus } from '@prisma/client';

import { prisma } from '../lib/prisma.js';
import type { MediaRecord } from './media.repository.js';

export type ProjectWithMedia = Project & {
  media: MediaRecord[];
  category: { id: string; name: string; slug: string } | null;
};

export interface ProjectListFilters {
  page: number;
  limit: number;
  skip: number;
  status?: ProjectStatus;
  featured?: boolean;
  search?: string;
}

export class ProjectRepository {
  private readonly include = {
    media: {
      orderBy: [{ isThumbnail: 'desc' as const }, { sortOrder: 'asc' as const }, { createdAt: 'asc' as const }],
    },
    category: { select: { id: true, name: true, slug: true } },
  };

  async findMany(filters: ProjectListFilters): Promise<{ items: ProjectWithMedia[]; total: number }> {
    const where: Prisma.ProjectWhereInput = {};

    if (filters.status) {
      where.status = filters.status;
    }

    if (typeof filters.featured === 'boolean') {
      where.featured = filters.featured;
    }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { slug: { contains: filters.search, mode: 'insensitive' } },
        { shortDescription: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await prisma.$transaction([
      prisma.project.findMany({
        where,
        include: this.include,
        orderBy: [{ featured: 'desc' }, { updatedAt: 'desc' }],
        skip: filters.skip,
        take: filters.limit,
      }),
      prisma.project.count({ where }),
    ]);

    return { items, total };
  }

  async findById(id: string): Promise<ProjectWithMedia | null> {
    return prisma.project.findUnique({
      where: { id },
      include: this.include,
    });
  }

  async findBySlug(slug: string): Promise<ProjectWithMedia | null> {
    return prisma.project.findUnique({
      where: { slug },
      include: this.include,
    });
  }

  async slugExists(slug: string, excludeId?: string): Promise<boolean> {
    const count = await prisma.project.count({
      where: {
        slug,
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
    });

    return count > 0;
  }

  async create(data: Prisma.ProjectCreateInput): Promise<ProjectWithMedia> {
    return prisma.project.create({
      data,
      include: this.include,
    });
  }

  async update(id: string, data: Prisma.ProjectUpdateInput): Promise<ProjectWithMedia> {
    return prisma.project.update({
      where: { id },
      data,
      include: this.include,
    });
  }

  async delete(id: string): Promise<ProjectWithMedia> {
    return prisma.project.delete({
      where: { id },
      include: this.include,
    });
  }
}

export const projectRepository = new ProjectRepository();
