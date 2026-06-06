import type { Media } from '@prisma/client';

import type { ProjectWithMedia } from '../../repositories/project.repository.js';

export interface ProjectMediaDto {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  alt: string | null;
  isThumbnail: boolean;
  sortOrder: number;
}

export interface ProjectDto {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  techStack: string[];
  architecture: string;
  githubUrl: string | null;
  liveUrl: string | null;
  featured: boolean;
  status: string;
  categoryId: string | null;
  category: { id: string; name: string; slug: string } | null;
  thumbnail: ProjectMediaDto | null;
  gallery: ProjectMediaDto[];
  createdAt: string;
  updatedAt: string;
}

function mapMedia(media: Media): ProjectMediaDto {
  return {
    id: media.id,
    filename: media.filename,
    url: media.url,
    mimeType: media.mimeType,
    size: media.size,
    alt: media.alt,
    isThumbnail: media.isThumbnail,
    sortOrder: media.sortOrder,
  };
}

export function mapProjectToDto(project: ProjectWithMedia): ProjectDto {
  const media = project.media.map(mapMedia);
  const thumbnail = media.find((item) => item.isThumbnail) ?? media[0] ?? null;
  const gallery = media.filter((item) => item.id !== thumbnail?.id);

  return {
    id: project.id,
    title: project.title,
    slug: project.slug,
    shortDescription: project.shortDescription,
    description: project.description,
    techStack: project.techStack,
    architecture: project.architecture,
    githubUrl: project.githubUrl,
    liveUrl: project.liveUrl,
    featured: project.featured,
    status: project.status,
    categoryId: project.categoryId,
    category: project.category,
    thumbnail,
    gallery,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
  };
}

export function mapMediaToDto(media: Media): ProjectMediaDto {
  return mapMedia(media);
}
