'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { QUERY_KEYS } from '@/constants/query-keys';
import { getErrorMessage } from '@/lib/errors';
import { blogService } from '@/features/blog/services/blog.service';
import { blogCategoryService } from '@/features/blog/services/blog-category.service';
import { tagService } from '@/features/blog/services/tag.service';
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
