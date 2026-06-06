import { ProjectStatus } from '@prisma/client';

import { HTTP_STATUS } from '../../constants/http-status.js';
import { blogRepository } from '../../repositories/blog.repository.js';
import { projectRepository } from '../../repositories/project.repository.js';
import { siteContentRepository } from '../../repositories/site-content.repository.js';
import { contactService } from '../contact/contact.service.js';
import { AppError } from '../../utils/app-error.js';
import {
  mapPublicBlogPost,
  mapPublicBlogSummary,
  mapPublicProject,
  mapPublicProjectSummary,
  type PublicAboutSectionDto,
  type PublicResumeDto,
  type PublicServiceDto,
  type PublicSiteDto,
  type PublicTestimonialDto,
} from './public.dto.js';
import type { PublicContactInput, PublicListQueryInput } from './public.validator.js';

export class PublicService {
  async getSite(): Promise<PublicSiteDto> {
    const settings = await siteContentRepository.getSiteSettings();

    if (!settings) {
      return {
        siteName: 'Portfolio',
        siteDescription: null,
        logoUrl: null,
        contactEmail: null,
        socialLinks: null,
      };
    }

    return {
      siteName: settings.siteName,
      siteDescription: settings.siteDescription,
      logoUrl: settings.logoUrl,
      contactEmail: settings.contactEmail,
      socialLinks: (settings.socialLinks as Record<string, string> | null) ?? null,
    };
  }

  async getAbout(): Promise<{ site: PublicSiteDto; sections: PublicAboutSectionDto[] }> {
    const [site, sections] = await Promise.all([
      this.getSite(),
      siteContentRepository.findKnowledgeByCategory('about'),
    ]);

    return {
      site,
      sections: sections.map((section) => ({
        id: section.id,
        title: section.title,
        content: section.content,
        category: section.category,
      })),
    };
  }

  async getServices(): Promise<PublicServiceDto[]> {
    const services = await siteContentRepository.findKnowledgeByCategory('services');
    return services.map((service) => ({
      id: service.id,
      title: service.title,
      content: service.content,
    }));
  }

  async getTestimonials(): Promise<PublicTestimonialDto[]> {
    const testimonials = await siteContentRepository.findFeaturedTestimonials();
    return testimonials.map((item) => ({
      id: item.id,
      clientName: item.clientName,
      company: item.company,
      designation: item.designation,
      content: item.content,
      rating: item.rating,
    }));
  }

  async getResume(): Promise<PublicResumeDto | null> {
    const resume = await siteContentRepository.findActiveResume();
    if (!resume) return null;

    return {
      id: resume.id,
      title: resume.title,
      fileUrl: resume.fileUrl,
      version: resume.version,
      updatedAt: resume.updatedAt.toISOString(),
    };
  }

  async listProjects(query: PublicListQueryInput) {
    const page = query.page;
    const limit = query.limit;
    const skip = (page - 1) * limit;

    const { items, total } = await projectRepository.findMany({
      page,
      limit,
      skip,
      status: ProjectStatus.PUBLISHED,
      featured: query.featured,
      search: query.search,
    });

    return {
      items: items.map(mapPublicProjectSummary),
      total,
      page,
      limit,
    };
  }

  async getProjectBySlug(slug: string) {
    const project = await projectRepository.findBySlug(slug);

    if (!project || project.status !== ProjectStatus.PUBLISHED) {
      throw new AppError('Project not found', HTTP_STATUS.NOT_FOUND);
    }

    return mapPublicProject(project);
  }

  async listBlogPosts(query: PublicListQueryInput) {
    const page = query.page;
    const limit = query.limit;
    const skip = (page - 1) * limit;

    const { items, total } = await blogRepository.findMany({
      page,
      limit,
      skip,
      published: true,
      search: query.search,
      lean: true,
    });

    return {
      items: items.map(mapPublicBlogSummary),
      total,
      page,
      limit,
    };
  }

  async getBlogPostBySlug(slug: string) {
    const post = await blogRepository.findBySlug(slug);

    if (!post || !post.published) {
      throw new AppError('Blog post not found', HTTP_STATUS.NOT_FOUND);
    }

    return mapPublicBlogPost(post);
  }

  async submitContact(input: PublicContactInput) {
    return contactService.submitContact(input);
  }
}

export const publicService = new PublicService();
