'use client';

import { useState } from 'react';
import { Eye, EyeOff, MoreHorizontal, Pencil, Plus, Trash2 } from 'lucide-react';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { AdminBulkActionBar } from '@/features/blog/components/admin-bulk-action-bar';
import { BulkConfirmDeleteDialog } from '@/features/blog/components/bulk-confirm-delete-dialog';
import {
  useBulkDeleteBlogCategories,
  useBulkPublishPostsForCategories,
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
import { useAutoSlugSync } from '@/hooks/use-auto-slug-sync';
import { useZodForm } from '@/hooks/use-zod-form';
import { cn } from '@/lib/utils';

export function BlogCategoriesView() {
  const { hasPermission } = useAuth();
  const canWrite = hasPermission(MODULE_PERMISSIONS.blog.write);
  const canDelete = hasPermission(MODULE_PERMISSIONS.blog.delete);
  const canPublish = hasPermission(MODULE_PERMISSIONS.blog.publish);
  const canSelect = canPublish || canDelete;

  const { data, isLoading, isError, refetch } = useBlogCategories();
  const createMutation = useCreateBlogCategory();
  const updateMutation = useUpdateBlogCategory();
  const deleteMutation = useDeleteBlogCategory();
  const bulkDeleteMutation = useBulkDeleteBlogCategories();
  const bulkPublishMutation = useBulkPublishPostsForCategories();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [deleteTargetIds, setDeleteTargetIds] = useState<string[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editing, setEditing] = useState<BlogCategory | null>(null);
  const form = useZodForm(blogCategoryFormSchema, blogCategoryFormDefaultValues);

  const categories = data ?? [];
  const allSelected = categories.length > 0 && categories.every((c) => selectedIds.includes(c.id));
  const someSelected = categories.some((c) => selectedIds.includes(c.id));
  const isBusy = bulkDeleteMutation.isPending || bulkPublishMutation.isPending || deleteMutation.isPending;

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
  const { markSlugManual } = useAutoSlugSync(form, {
    title: name,
    slugField: 'slug',
    enabled: !editing,
  });

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(categories.map((c) => c.id));
    }
  };

  const toggleOne = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  const handlePublishPosts = (categoryIds: string[], published: boolean) => {
    bulkPublishMutation.mutate(
      { categoryIds, published },
      { onSuccess: () => setSelectedIds([]) }
    );
  };

  const openDeleteDialog = (ids: string[]) => {
    setDeleteTargetIds(ids);
    setBulkDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteTargetIds.length === 0) return;

    if (deleteTargetIds.length === 1) {
      await deleteMutation.mutateAsync(deleteTargetIds[0]!);
    } else {
      await bulkDeleteMutation.mutateAsync(deleteTargetIds);
    }

    setBulkDeleteOpen(false);
    setDeleteTargetIds([]);
    setSelectedIds((current) => current.filter((id) => !deleteTargetIds.includes(id)));
  };

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

      {!isLoading && !isError && categories.length === 0 ? (
        <EmptyState title="No categories yet" description="Create a category to organize blog posts." />
      ) : null}

      {!isLoading && !isError && categories.length > 0 ? (
        <div className="space-y-4">
          <AdminBulkActionBar selectedCount={selectedIds.length} onClear={() => setSelectedIds([])}>
            {canPublish ? (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={isBusy}
                  onClick={() => handlePublishPosts(selectedIds, true)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Publish posts
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={isBusy}
                  onClick={() => handlePublishPosts(selectedIds, false)}
                >
                  <EyeOff className="mr-2 h-4 w-4" />
                  Unpublish posts
                </Button>
              </>
            ) : null}
            {canDelete ? (
              <Button
                size="sm"
                variant="destructive"
                disabled={isBusy}
                onClick={() => openDeleteDialog(selectedIds)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            ) : null}
          </AdminBulkActionBar>

          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  {canSelect ? (
                    <TableHead className="w-10">
                      <input
                        type="checkbox"
                        role="checkbox"
                        aria-label="Select all categories"
                        checked={allSelected}
                        ref={(input) => {
                          if (input) input.indeterminate = someSelected && !allSelected;
                        }}
                        onChange={toggleAll}
                        className="h-4 w-4 rounded border-input accent-accent"
                      />
                    </TableHead>
                  ) : null}
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Posts</TableHead>
                  <TableHead className="w-[70px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => {
                  const isSelected = selectedIds.includes(category.id);

                  return (
                    <TableRow key={category.id} className={cn(isSelected && 'bg-muted/30')}>
                      {canSelect ? (
                        <TableCell>
                          <input
                            type="checkbox"
                            role="checkbox"
                            aria-label={`Select ${category.name}`}
                            checked={isSelected}
                            onChange={() => toggleOne(category.id)}
                            className="h-4 w-4 rounded border-input accent-accent"
                          />
                        </TableCell>
                      ) : null}
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell>
                        <code className="text-xs">{category.slug}</code>
                      </TableCell>
                      <TableCell>{category.postCount}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" aria-label={`Actions for ${category.name}`}>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {canWrite ? (
                              <DropdownMenuItem onClick={() => openEdit(category)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                            ) : null}
                            {canPublish ? (
                              <>
                                <DropdownMenuItem
                                  disabled={isBusy}
                                  onClick={() => handlePublishPosts([category.id], true)}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  Publish posts
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  disabled={isBusy}
                                  onClick={() => handlePublishPosts([category.id], false)}
                                >
                                  <EyeOff className="mr-2 h-4 w-4" />
                                  Unpublish posts
                                </DropdownMenuItem>
                              </>
                            ) : null}
                            {canDelete ? (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => openDeleteDialog([category.id])}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </>
                            ) : null}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
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
            <FormField control={form.control} name="slug" label="Slug" onValueChange={markSlugManual} />
            <FormField control={form.control} name="description" label="Description" as="textarea" />
            <Button type="submit" variant="accent" disabled={createMutation.isPending || updateMutation.isPending}>
              {editing ? 'Save changes' : 'Create category'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <BulkConfirmDeleteDialog
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        count={deleteTargetIds.length}
        entityLabel={deleteTargetIds.length === 1 ? 'category' : 'categories'}
        isPending={bulkDeleteMutation.isPending || deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
      />
    </BlogModuleShell>
  );
}
