import type { BlogPostWithRelations } from '../../repositories/blog.repository.js';
import type { ProjectWithMedia } from '../../repositories/project.repository.js';
import { mapProjectToDto, type ProjectMediaDto } from '../projects/projects.dto.js';

export interface PublicAuthorDto {
  id: string;
  name: string;
}

export interface PublicBlogPostSummaryDto {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string | null;
  readingTimeMinutes: number;
  publishedAt: string | null;
  updatedAt: string;
  category: { id: string; name: string; slug: string } | null;
  author: PublicAuthorDto | null;
  tags: { id: string; name: string; slug: string }[];
}

export interface PublicBlogPostDto extends PublicBlogPostSummaryDto {
  content: string;
  contentFormat: string;
  seoTitle: string | null;
  seoDescription: string | null;
}

export interface PublicProjectSummaryDto {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  techStack: string[];
  featured: boolean;
  category: { id: string; name: string; slug: string } | null;
  thumbnail: ProjectMediaDto | null;
  liveUrl: string | null;
  githubUrl: string | null;
}

export interface PublicProjectDto extends PublicProjectSummaryDto {
  description: string;
  architecture: string;
  gallery: ProjectMediaDto[];
}

export interface PublicSiteDto {
  siteName: string;
  siteDescription: string | null;
  logoUrl: string | null;
  contactEmail: string | null;
  socialLinks: Record<string, string> | null;
}

export interface PublicAboutSectionDto {
  id: string;
  title: string;
  content: string;
  category: string;
}

export interface PublicServiceDto {
  id: string;
  title: string;
  content: string;
}

export interface PublicTestimonialDto {
  id: string;
  clientName: string;
  company: string | null;
  designation: string | null;
  content: string;
  rating: number | null;
}

export interface PublicResumeDto {
  id: string;
  title: string;
  fileUrl: string;
  fileName: string;
  version: string;
  updatedAt: string;
}

export function mapPublicProjectSummary(project: ProjectWithMedia): PublicProjectSummaryDto {
  const dto = mapProjectToDto(project);
  return {
    id: dto.id,
    title: dto.title,
    slug: dto.slug,
    shortDescription: dto.shortDescription,
    techStack: dto.techStack,
    featured: dto.featured,
    category: dto.category,
    thumbnail: dto.thumbnail,
    liveUrl: dto.liveUrl,
    githubUrl: dto.githubUrl,
  };
}

export function mapPublicProject(project: ProjectWithMedia): PublicProjectDto {
  const dto = mapProjectToDto(project);
  return {
    ...mapPublicProjectSummary(project),
    description: dto.description,
    architecture: dto.architecture,
    gallery: dto.gallery,
  };
}

export function mapPublicBlogSummary(post: BlogPostWithRelations): PublicBlogPostSummaryDto {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    featuredImage: post.featuredImage,
    readingTimeMinutes: post.readingTimeMinutes,
    publishedAt: post.publishedAt?.toISOString() ?? null,
    updatedAt: post.updatedAt.toISOString(),
    category: post.category,
    author: post.author ? { id: post.author.id, name: post.author.name } : null,
    tags: post.tags.map(({ tag }) => ({ id: tag.id, name: tag.name, slug: tag.slug })),
  };
}

export function mapPublicBlogPost(post: BlogPostWithRelations): PublicBlogPostDto {
  return {
    ...mapPublicBlogSummary(post),
    content: post.content,
    contentFormat: post.contentFormat,
    seoTitle: post.seoTitle,
    seoDescription: post.seoDescription,
  };
}
