import type { BlogCategoryWithCount } from '../../repositories/blog-category.repository.js';

export interface BlogCategoryDto {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  postCount: number;
  createdAt: string;
  updatedAt: string;
}

export function mapBlogCategoryToDto(category: BlogCategoryWithCount): BlogCategoryDto {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    postCount: category._count.posts,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString(),
  };
}
