import type { BlogPostWithRelations } from '../../repositories/blog.repository.js';

export interface BlogTagDto {
  id: string;
  name: string;
  slug: string;
}

export interface BlogPostDto {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  contentFormat: string;
  featuredImage: string | null;
  readingTimeMinutes: number;
  published: boolean;
  publishedAt: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  categoryId: string | null;
  category: { id: string; name: string; slug: string } | null;
  authorId: string | null;
  author: { id: string; name: string; email: string } | null;
  tags: BlogTagDto[];
  createdAt: string;
  updatedAt: string;
}

export function mapBlogPostToDto(post: BlogPostWithRelations): BlogPostDto {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    contentFormat: post.contentFormat,
    featuredImage: post.featuredImage,
    readingTimeMinutes: post.readingTimeMinutes,
    published: post.published,
    publishedAt: post.publishedAt?.toISOString() ?? null,
    seoTitle: post.seoTitle,
    seoDescription: post.seoDescription,
    categoryId: post.categoryId,
    category: post.category,
    authorId: post.authorId,
    author: post.author,
    tags: post.tags.map(({ tag }) => ({ id: tag.id, name: tag.name, slug: tag.slug })),
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  };
}
