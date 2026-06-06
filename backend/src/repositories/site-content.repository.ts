import { prisma } from '../lib/prisma.js';

export class SiteContentRepository {
  async getSiteSettings() {
    return prisma.siteSettings.findUnique({ where: { id: 'default' } });
  }

  async findActiveResume() {
    return prisma.resume.findFirst({
      where: { isActive: true },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findFeaturedTestimonials(limit = 6) {
    return prisma.testimonial.findMany({
      where: { featured: true },
      orderBy: { updatedAt: 'desc' },
      take: limit,
    });
  }

  async findKnowledgeByCategory(category: string) {
    return prisma.knowledgeBase.findMany({
      where: { category, active: true },
      orderBy: { title: 'asc' },
    });
  }
}

export const siteContentRepository = new SiteContentRepository();
