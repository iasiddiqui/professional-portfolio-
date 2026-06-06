'use client';

import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS, QUERY_STALE_TIME } from '@/constants/query-keys';
import { blogService } from '@/features/blog/services/blog.service';
import { blogCategoryService } from '@/features/blog/services/blog-category.service';
import { tagService } from '@/features/blog/services/tag.service';
import type { BlogListParams } from '@/features/blog/types/blog.types';

export function useBlogPosts(params?: BlogListParams) {
  return useQuery({
    queryKey: QUERY_KEYS.blog.list(params),
    queryFn: () => blogService.list(params),
    staleTime: QUERY_STALE_TIME.default,
  });
}

export function useBlogPost(id: string, enabled = true) {
  return useQuery({
    queryKey: QUERY_KEYS.blog.detail(id),
    queryFn: () => blogService.getById(id),
    staleTime: QUERY_STALE_TIME.default,
    enabled: Boolean(id) && enabled,
  });
}

export function useBlogCategories() {
  return useQuery({
    queryKey: QUERY_KEYS.blog.categories.all,
    queryFn: () => blogCategoryService.list(),
    staleTime: QUERY_STALE_TIME.long,
  });
}

export function useTags() {
  return useQuery({
    queryKey: QUERY_KEYS.blog.tags.all,
    queryFn: () => tagService.list(),
    staleTime: QUERY_STALE_TIME.long,
  });
}
