'use client';

import { useEffect, useState } from 'react';

import { FormField } from '@/components/forms/form-field';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { EmptyState } from '@/components/common/empty-state';
import { ErrorState } from '@/components/common/error-state';
import { Loader } from '@/components/common/loader';
import { BlogModuleShell } from '@/features/admin/components/module-shells';
import {
  useCreateBlogCategory,
  useDeleteBlogCategory,
  useUpdateBlogCategory,
} from '@/features/blog/hooks/use-blog-mutations';
import { useBlogCategories } from '@/features/blog/hooks/use-blog';
import {
  blogCategoryFormDefaultValues,
  blogCategoryFormSchema,
  type BlogCategoryFormValues,
} from '@/features/blog/schemas/blog.schemas';
import type { BlogCategory } from '@/features/blog/types/blog.types';
import { MODULE_PERMISSIONS } from '@/constants/permissions';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/features/auth/providers/auth-provider';
import { useZodForm } from '@/hooks/use-zod-form';
import { slugify } from '@/utils/string';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';

export function BlogCategoriesView() {
  const { hasPermission } = useAuth();
  const canWrite = hasPermission(MODULE_PERMISSIONS.blog.write);
  const canDelete = hasPermission(MODULE_PERMISSIONS.blog.delete);

  const { data, isLoading, isError, refetch } = useBlogCategories();
  const createMutation = useCreateBlogCategory();
  const updateMutation = useUpdateBlogCategory();
  const deleteMutation = useDeleteBlogCategory();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<BlogCategory | null>(null);
  const form = useZodForm(blogCategoryFormSchema, blogCategoryFormDefaultValues);

  const openCreate = () => {
    setEditing(null);
    form.reset(blogCategoryFormDefaultValues);
    setDialogOpen(true);
  };

  const openEdit = (category: BlogCategory) => {
    setEditing(category);
    form.reset({
      name: category.name,
      slug: category.slug,
      description: category.description ?? '',
    });
    setDialogOpen(true);
  };

  const name = form.watch('name');
  useEffect(() => {
    if (!editing && name && !form.getValues('slug')) {
      form.setValue('slug', slugify(name));
    }
  }, [editing, form, name]);

  const handleSubmit = form.handleSubmit(async (values: BlogCategoryFormValues) => {
    const payload = {
      name: values.name,
      slug: values.slug || undefined,
      description: values.description || null,
    };

    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, payload });
    } else {
      await createMutation.mutateAsync(payload);
    }

    setDialogOpen(false);
  });

  return (
    <BlogModuleShell
      title="Categories"
      description="Organize blog posts into categories."
      breadcrumbs={[
        { label: 'Dashboard', href: ROUTES.admin.dashboard },
        { label: 'Blog', href: ROUTES.admin.blog },
        { label: 'Categories' },
      ]}
      actions={
        canWrite ? (
          <Button variant="accent" size="sm" onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            New category
          </Button>
        ) : undefined
      }
    >
      {isLoading ? <Loader label="Loading categories..." /> : null}
      {isError ? <ErrorState title="Failed to load categories" onRetry={() => void refetch()} /> : null}

      {!isLoading && !isError && data?.length === 0 ? (
        <EmptyState title="No categories yet" description="Create a category to organize blog posts." />
      ) : null}

      {!isLoading && !isError && data && data.length > 0 ? (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Posts</TableHead>
                <TableHead className="w-[100px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>
                    <code className="text-xs">{category.slug}</code>
                  </TableCell>
                  <TableCell>{category.postCount}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {canWrite ? (
                        <Button variant="ghost" size="icon" onClick={() => openEdit(category)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      ) : null}
                      {canDelete ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => void deleteMutation.mutateAsync(category.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      ) : null}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : null}

      <div className="mt-4">
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.admin.blog}>Back to blog</Link>
        </Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit category' : 'New category'}</DialogTitle>
            <DialogDescription>Categories help organize blog posts.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField control={form.control} name="name" label="Name" />
            <FormField control={form.control} name="slug" label="Slug" />
            <FormField control={form.control} name="description" label="Description" as="textarea" />
            <Button type="submit" variant="accent" disabled={createMutation.isPending || updateMutation.isPending}>
              {editing ? 'Save changes' : 'Create category'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </BlogModuleShell>
  );
}
