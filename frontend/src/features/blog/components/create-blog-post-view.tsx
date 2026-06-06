'use client';

import { useRouter } from 'next/navigation';

import { BlogModuleShell } from '@/features/admin/components/module-shells';
import { BlogForm } from '@/features/blog/components/blog-form';
import { useCreateBlogPost } from '@/features/blog/hooks/use-blog-mutations';
import {
  blogFormDefaultValues,
  blogFormSchema,
  toBlogPayload,
  type BlogFormValues,
} from '@/features/blog/schemas/blog.schemas';
import { ROUTES } from '@/constants/routes';
import { useZodForm } from '@/hooks/use-zod-form';

export function CreateBlogPostView() {
  const router = useRouter();
  const createMutation = useCreateBlogPost();
  const form = useZodForm(blogFormSchema, blogFormDefaultValues);

  const handleSubmit = async (values: BlogFormValues) => {
    const post = await createMutation.mutateAsync(toBlogPayload(values));
    router.push(ROUTES.admin.blogPost(post.id));
  };

  return (
    <BlogModuleShell
      title="Create blog post"
      description="Write a new blog post with MDX content, SEO metadata, and publishing settings."
      breadcrumbs={[
        { label: 'Dashboard', href: ROUTES.admin.dashboard },
        { label: 'Blog', href: ROUTES.admin.blog },
        { label: 'Create' },
      ]}
    >
      <BlogForm
        form={form}
        onSubmit={handleSubmit}
        submitLabel="Create post"
        isSubmitting={createMutation.isPending}
      />
    </BlogModuleShell>
  );
}
