export type ContentFormat = 'MDX' | 'MARKDOWN' | 'HTML';

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  postCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  contentFormat: ContentFormat;
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
  tags: BlogTag[];
  createdAt: string;
  updatedAt: string;
}

export interface BlogListParams {
  page?: number;
  limit?: number;
  published?: boolean;
  categoryId?: string;
  tagId?: string;
  search?: string;
}

export interface BlogListResult {
  items: BlogPost[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface CreateBlogPostPayload {
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  contentFormat?: ContentFormat;
  featuredImage?: string | null;
  published?: boolean;
  seoTitle?: string | null;
  seoDescription?: string | null;
  categoryId?: string | null;
  tagIds?: string[];
}

export type UpdateBlogPostPayload = Partial<CreateBlogPostPayload>;

export interface CreateBlogCategoryPayload {
  name: string;
  slug?: string;
  description?: string | null;
}

export type UpdateBlogCategoryPayload = Partial<CreateBlogCategoryPayload>;

export interface CreateTagPayload {
  name: string;
  slug?: string;
}

export type UpdateTagPayload = Partial<CreateTagPayload>;

export interface TagEntity {
  id: string;
  name: string;
  slug: string;
  blogPostCount: number;
  projectCount: number;
  createdAt: string;
  updatedAt: string;
}
