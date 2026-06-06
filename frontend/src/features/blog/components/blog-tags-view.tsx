'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';

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
import { useCreateTag, useDeleteTag, useUpdateTag } from '@/features/blog/hooks/use-blog-mutations';
import { useTags } from '@/features/blog/hooks/use-blog';
import {
  tagFormDefaultValues,
  tagFormSchema,
  type TagFormValues,
} from '@/features/blog/schemas/blog.schemas';
import type { TagEntity } from '@/features/blog/types/blog.types';
import { MODULE_PERMISSIONS } from '@/constants/permissions';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/features/auth/providers/auth-provider';
import { useZodForm } from '@/hooks/use-zod-form';
import { slugify } from '@/utils/string';

export function BlogTagsView() {
  const { hasPermission } = useAuth();
  const canWrite = hasPermission(MODULE_PERMISSIONS.blog.write);
  const canDelete = hasPermission(MODULE_PERMISSIONS.blog.delete);

  const { data, isLoading, isError, refetch } = useTags();
  const createMutation = useCreateTag();
  const updateMutation = useUpdateTag();
  const deleteMutation = useDeleteTag();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<TagEntity | null>(null);
  const form = useZodForm(tagFormSchema, tagFormDefaultValues);

  const openCreate = () => {
    setEditing(null);
    form.reset(tagFormDefaultValues);
    setDialogOpen(true);
  };

  const openEdit = (tag: TagEntity) => {
    setEditing(tag);
    form.reset({ name: tag.name, slug: tag.slug });
    setDialogOpen(true);
  };

  const name = form.watch('name');
  useEffect(() => {
    if (!editing && name && !form.getValues('slug')) {
      form.setValue('slug', slugify(name));
    }
  }, [editing, form, name]);

  const handleSubmit = form.handleSubmit(async (values: TagFormValues) => {
    const payload = { name: values.name, slug: values.slug || undefined };

    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, payload });
    } else {
      await createMutation.mutateAsync(payload);
    }

    setDialogOpen(false);
  });

  return (
    <BlogModuleShell
      title="Tags"
      description="Manage tags for blog posts and projects."
      breadcrumbs={[
        { label: 'Dashboard', href: ROUTES.admin.dashboard },
        { label: 'Blog', href: ROUTES.admin.blog },
        { label: 'Tags' },
      ]}
      actions={
        canWrite ? (
          <Button variant="accent" size="sm" onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            New tag
          </Button>
        ) : undefined
      }
    >
      {isLoading ? <Loader label="Loading tags..." /> : null}
      {isError ? <ErrorState title="Failed to load tags" onRetry={() => void refetch()} /> : null}

      {!isLoading && !isError && data?.length === 0 ? (
        <EmptyState title="No tags yet" description="Create tags to label blog posts." />
      ) : null}

      {!isLoading && !isError && data && data.length > 0 ? (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Blog posts</TableHead>
                <TableHead>Projects</TableHead>
                <TableHead className="w-[100px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((tag) => (
                <TableRow key={tag.id}>
                  <TableCell className="font-medium">{tag.name}</TableCell>
                  <TableCell>
                    <code className="text-xs">{tag.slug}</code>
                  </TableCell>
                  <TableCell>{tag.blogPostCount}</TableCell>
                  <TableCell>{tag.projectCount}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {canWrite ? (
                        <Button variant="ghost" size="icon" onClick={() => openEdit(tag)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      ) : null}
                      {canDelete ? (
                        <Button variant="ghost" size="icon" onClick={() => void deleteMutation.mutateAsync(tag.id)}>
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
            <DialogTitle>{editing ? 'Edit tag' : 'New tag'}</DialogTitle>
            <DialogDescription>Tags can be used across blog posts.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField control={form.control} name="name" label="Name" />
            <FormField control={form.control} name="slug" label="Slug" />
            <Button type="submit" variant="accent" disabled={createMutation.isPending || updateMutation.isPending}>
              {editing ? 'Save changes' : 'Create tag'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </BlogModuleShell>
  );
}
