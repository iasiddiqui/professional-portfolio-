'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { ErrorState } from '@/components/common/error-state';
import { Loader } from '@/components/common/loader';
import { BlogModuleShell } from '@/features/admin/components/module-shells';
import { BlogForm } from '@/features/blog/components/blog-form';
import { useUpdateBlogPost } from '@/features/blog/hooks/use-blog-mutations';
import { useBlogPost } from '@/features/blog/hooks/use-blog';
import {
  blogFormDefaultValues,
  blogFormSchema,
  toBlogFormValues,
  toBlogPayload,
  type BlogFormValues,
} from '@/features/blog/schemas/blog.schemas';
import { ROUTES } from '@/constants/routes';
import { useZodForm } from '@/hooks/use-zod-form';

interface EditBlogPostViewProps {
  postId: string;
}

export function EditBlogPostView({ postId }: EditBlogPostViewProps) {
  const router = useRouter();
  const { data: post, isLoading, isError, refetch } = useBlogPost(postId);
  const updateMutation = useUpdateBlogPost(postId);
  const form = useZodForm(blogFormSchema, blogFormDefaultValues);

  useEffect(() => {
    if (post) form.reset(toBlogFormValues(post));
  }, [form, post]);

  const handleSubmit = async (values: BlogFormValues) => {
    await updateMutation.mutateAsync(toBlogPayload(values));
    router.push(ROUTES.admin.blogPost(postId));
  };

  if (isLoading) {
    return (
      <BlogModuleShell title="Edit post">
        <Loader label="Loading post..." />
      </BlogModuleShell>
    );
  }

  if (isError || !post) {
    return (
      <BlogModuleShell title="Edit post">
        <ErrorState title="Post not found" onRetry={() => void refetch()} />
      </BlogModuleShell>
    );
  }

  return (
    <BlogModuleShell
      title={`Edit ${post.title}`}
      breadcrumbs={[
        { label: 'Dashboard', href: ROUTES.admin.dashboard },
        { label: 'Blog', href: ROUTES.admin.blog },
        { label: post.title, href: ROUTES.admin.blogPost(post.id) },
        { label: 'Edit' },
      ]}
    >
      <BlogForm
        form={form}
        onSubmit={handleSubmit}
        submitLabel="Save changes"
        isSubmitting={updateMutation.isPending}
        syncSlugFromTitle={false}
      />
    </BlogModuleShell>
  );
}
