import type { MetadataRoute } from 'next';

import { ROUTES } from '@/constants/routes';
import { INDEXABLE_STATIC_ROUTES, absoluteUrl } from '@/lib/seo/config';
import { publicApi, type PublicListParams } from '@/lib/public-api';

const SITEMAP_PAGE_SIZE = 100;
const SITEMAP_MAX_PAGES = 10;

async function fetchAllPages<T>(
  fetchPage: (params: PublicListParams) => Promise<{ items: T[]; pagination: { totalPages: number } } | null>
): Promise<T[]> {
  const first = await fetchPage({ page: 1, limit: SITEMAP_PAGE_SIZE }).catch(() => null);
  if (!first) return [];

  const items = [...first.items];
  const totalPages = Math.min(first.pagination.totalPages, SITEMAP_MAX_PAGES);

  if (totalPages <= 1) return items;

  const remaining = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, index) =>
      fetchPage({ page: index + 2, limit: SITEMAP_PAGE_SIZE }).catch(() => null)
    )
  );

  for (const page of remaining) {
    if (page?.items.length) items.push(...page.items);
  }

  return items;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = INDEXABLE_STATIC_ROUTES.map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: path === ROUTES.home ? 'daily' : 'weekly',
    priority: path === ROUTES.home ? 1 : 0.8,
  }));

  const [projects, blogPosts] = await Promise.all([
    fetchAllPages((params) => publicApi.listProjects(params)),
    fetchAllPages((params) => publicApi.listBlogPosts(params)),
  ]);

  const projectEntries: MetadataRoute.Sitemap = projects.map((project) => ({
    url: absoluteUrl(ROUTES.project(project.slug)),
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: absoluteUrl(ROUTES.blogPost(post.slug)),
    lastModified: post.publishedAt ? new Date(post.publishedAt) : now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...projectEntries, ...blogEntries];
}
