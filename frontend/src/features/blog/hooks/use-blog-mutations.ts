'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { QUERY_KEYS } from '@/constants/query-keys';
import { getErrorMessage } from '@/lib/errors';
import { blogService } from '@/features/blog/services/blog.service';
import { blogCategoryService } from '@/features/blog/services/blog-category.service';
import { tagService } from '@/features/blog/services/tag.service';
import {
  collectPostIdsByCategoryIds,
  collectPostIdsByTagIds,
} from '@/features/blog/utils/collect-post-ids';
import type {
  CreateBlogCategoryPayload,
  CreateBlogPostPayload,
  CreateTagPayload,
  UpdateBlogCategoryPayload,
  UpdateBlogPostPayload,
  UpdateTagPayload,
} from '@/features/blog/types/blog.types';

export function useCreateBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBlogPostPayload) => blogService.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.blog.all });
      toast.success('Blog post created successfully');
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Failed to create blog post')),
  });
}

export function useUpdateBlogPost(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateBlogPostPayload) => blogService.update(id, payload),
    onSuccess: (post) => {
      queryClient.setQueryData(QUERY_KEYS.blog.detail(id), post);
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.blog.all });
      toast.success('Blog post updated successfully');
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Failed to update blog post')),
  });
}

export function usePublishBlogPost(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (published: boolean) => blogService.publish(id, published),
    onSuccess: (post) => {
      queryClient.setQueryData(QUERY_KEYS.blog.detail(id), post);
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.blog.all });
      toast.success(post.published ? 'Blog post published' : 'Blog post unpublished');
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Failed to update publish status')),
  });
}

export function usePublishBlogPostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, published }: { id: string; published: boolean }) =>
      blogService.publish(id, published),
    onSuccess: (post) => {
      queryClient.setQueryData(QUERY_KEYS.blog.detail(post.id), post);
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.blog.all });
      toast.success(post.published ? 'Blog post published' : 'Blog post unpublished');
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Failed to update publish status')),
  });
}

export function useBulkPublishBlogPosts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ ids, published }: { ids: string[]; published: boolean }) => {
      const results = await Promise.allSettled(
        ids.map((id) => blogService.publish(id, published))
      );
      const succeeded = results.filter((result) => result.status === 'fulfilled').length;
      const failed = ids.length - succeeded;

      if (succeeded === 0) {
        throw new Error(`Failed to ${published ? 'publish' : 'unpublish'} selected posts`);
      }

      return { succeeded, failed, published };
    },
    onSuccess: ({ succeeded, failed, published }) => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.blog.all });
      const action = published ? 'published' : 'unpublished';
      if (failed > 0) {
        toast.success(`${succeeded} post(s) ${action}, ${failed} failed`);
      } else {
        toast.success(`${succeeded} post(s) ${action}`);
      }
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Bulk publish update failed')),
  });
}

export function useBulkDeleteBlogPosts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      const results = await Promise.allSettled(ids.map((id) => blogService.delete(id)));
      const succeeded = results.filter((result) => result.status === 'fulfilled').length;
      const failed = ids.length - succeeded;

      if (succeeded === 0) {
        throw new Error('Failed to delete selected posts');
      }

      return { succeeded, failed };
    },
    onSuccess: ({ succeeded, failed }) => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.blog.all });
      if (failed > 0) {
        toast.success(`${succeeded} post(s) deleted, ${failed} failed`);
      } else {
        toast.success(`${succeeded} post(s) deleted`);
      }
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Bulk delete failed')),
  });
}

export function useDeleteBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => blogService.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.blog.all });
      toast.success('Blog post deleted successfully');
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Failed to delete blog post')),
  });
}

export function useCreateBlogCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBlogCategoryPayload) => blogCategoryService.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.blog.categories.all });
      toast.success('Category created successfully');
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Failed to create category')),
  });
}

export function useUpdateBlogCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateBlogCategoryPayload }) =>
      blogCategoryService.update(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.blog.categories.all });
      toast.success('Category updated successfully');
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Failed to update category')),
  });
}

export function useDeleteBlogCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => blogCategoryService.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.blog.categories.all });
      toast.success('Category deleted successfully');
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Failed to delete category')),
  });
}

export function useBulkDeleteBlogCategories() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      const results = await Promise.allSettled(ids.map((id) => blogCategoryService.delete(id)));
      const succeeded = results.filter((result) => result.status === 'fulfilled').length;
      const failed = ids.length - succeeded;

      if (succeeded === 0) {
        throw new Error('Failed to delete selected categories');
      }

      return { succeeded, failed };
    },
    onSuccess: ({ succeeded, failed }) => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.blog.categories.all });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.blog.all });
      if (failed > 0) {
        toast.success(`${succeeded} categor(ies) deleted, ${failed} failed`);
      } else {
        toast.success(`${succeeded} categor(ies) deleted`);
      }
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Bulk delete failed')),
  });
}

export function useBulkPublishPostsForCategories() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ categoryIds, published }: { categoryIds: string[]; published: boolean }) => {
      const postIds = await collectPostIdsByCategoryIds(categoryIds);
      if (postIds.length === 0) {
        throw new Error('No blog posts found in selected categories');
      }

      const results = await Promise.allSettled(
        postIds.map((id) => blogService.publish(id, published))
      );
      const succeeded = results.filter((result) => result.status === 'fulfilled').length;
      const failed = postIds.length - succeeded;

      if (succeeded === 0) {
        throw new Error(`Failed to ${published ? 'publish' : 'unpublish'} posts`);
      }

      return { succeeded, failed, published, postCount: postIds.length };
    },
    onSuccess: ({ succeeded, failed, published, postCount }) => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.blog.all });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.blog.categories.all });
      const action = published ? 'published' : 'unpublished';
      if (failed > 0) {
        toast.success(`${succeeded}/${postCount} post(s) ${action}, ${failed} failed`);
      } else {
        toast.success(`${succeeded} post(s) ${action}`);
      }
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Failed to update posts')),
  });
}

export function useCreateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTagPayload) => tagService.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.blog.tags.all });
      toast.success('Tag created successfully');
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Failed to create tag')),
  });
}

export function useUpdateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTagPayload }) =>
      tagService.update(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.blog.tags.all });
      toast.success('Tag updated successfully');
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Failed to update tag')),
  });
}

export function useDeleteTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tagService.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.blog.tags.all });
      toast.success('Tag deleted successfully');
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Failed to delete tag')),
  });
}

export function useBulkDeleteTags() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      const results = await Promise.allSettled(ids.map((id) => tagService.delete(id)));
      const succeeded = results.filter((result) => result.status === 'fulfilled').length;
      const failed = ids.length - succeeded;

      if (succeeded === 0) {
        throw new Error('Failed to delete selected tags');
      }

      return { succeeded, failed };
    },
    onSuccess: ({ succeeded, failed }) => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.blog.tags.all });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.blog.all });
      if (failed > 0) {
        toast.success(`${succeeded} tag(s) deleted, ${failed} failed`);
      } else {
        toast.success(`${succeeded} tag(s) deleted`);
      }
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Bulk delete failed')),
  });
}

export function useBulkPublishPostsForTags() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ tagIds, published }: { tagIds: string[]; published: boolean }) => {
      const postIds = await collectPostIdsByTagIds(tagIds);
      if (postIds.length === 0) {
        throw new Error('No blog posts found with selected tags');
      }

      const results = await Promise.allSettled(
        postIds.map((id) => blogService.publish(id, published))
      );
      const succeeded = results.filter((result) => result.status === 'fulfilled').length;
      const failed = postIds.length - succeeded;

      if (succeeded === 0) {
        throw new Error(`Failed to ${published ? 'publish' : 'unpublish'} posts`);
      }

      return { succeeded, failed, published, postCount: postIds.length };
    },
    onSuccess: ({ succeeded, failed, published, postCount }) => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.blog.all });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.blog.tags.all });
      const action = published ? 'published' : 'unpublished';
      if (failed > 0) {
        toast.success(`${succeeded}/${postCount} post(s) ${action}, ${failed} failed`);
      } else {
        toast.success(`${succeeded} post(s) ${action}`);
      }
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Failed to update posts')),
  });
}
