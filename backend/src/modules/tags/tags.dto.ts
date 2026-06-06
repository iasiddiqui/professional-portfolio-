import type { TagWithCounts } from '../../repositories/tag.repository.js';

export interface TagDto {
  id: string;
  name: string;
  slug: string;
  blogPostCount: number;
  projectCount: number;
  createdAt: string;
  updatedAt: string;
}

export function mapTagToDto(tag: TagWithCounts): TagDto {
  return {
    id: tag.id,
    name: tag.name,
    slug: tag.slug,
    blogPostCount: tag._count.blogPosts,
    projectCount: tag._count.projects,
    createdAt: tag.createdAt.toISOString(),
    updatedAt: tag.updatedAt.toISOString(),
  };
}
