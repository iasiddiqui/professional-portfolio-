'use client';

import { useEffect, useState } from 'react';
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
  useBulkDeleteTags,
  useBulkPublishPostsForTags,
  useCreateTag,
  useDeleteTag,
  useUpdateTag,
} from '@/features/blog/hooks/use-blog-mutations';
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
import { cn } from '@/lib/utils';
import { slugify } from '@/utils/string';

export function BlogTagsView() {
  const { hasPermission } = useAuth();
  const canWrite = hasPermission(MODULE_PERMISSIONS.blog.write);
  const canDelete = hasPermission(MODULE_PERMISSIONS.blog.delete);
  const canPublish = hasPermission(MODULE_PERMISSIONS.blog.publish);
  const canSelect = canPublish || canDelete;

  const { data, isLoading, isError, refetch } = useTags();
  const createMutation = useCreateTag();
  const updateMutation = useUpdateTag();
  const deleteMutation = useDeleteTag();
  const bulkDeleteMutation = useBulkDeleteTags();
  const bulkPublishMutation = useBulkPublishPostsForTags();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [deleteTargetIds, setDeleteTargetIds] = useState<string[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editing, setEditing] = useState<TagEntity | null>(null);
  const form = useZodForm(tagFormSchema, tagFormDefaultValues);

  const tags = data ?? [];
  const allSelected = tags.length > 0 && tags.every((t) => selectedIds.includes(t.id));
  const someSelected = tags.some((t) => selectedIds.includes(t.id));
  const isBusy = bulkDeleteMutation.isPending || bulkPublishMutation.isPending || deleteMutation.isPending;

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

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(tags.map((t) => t.id));
    }
  };

  const toggleOne = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  const handlePublishPosts = (tagIds: string[], published: boolean) => {
    bulkPublishMutation.mutate({ tagIds, published }, { onSuccess: () => setSelectedIds([]) });
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

      {!isLoading && !isError && tags.length === 0 ? (
        <EmptyState title="No tags yet" description="Create tags to label blog posts." />
      ) : null}

      {!isLoading && !isError && tags.length > 0 ? (
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
                        aria-label="Select all tags"
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
                  <TableHead>Blog posts</TableHead>
                  <TableHead>Projects</TableHead>
                  <TableHead className="w-[70px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {tags.map((tag) => {
                  const isSelected = selectedIds.includes(tag.id);

                  return (
                    <TableRow key={tag.id} className={cn(isSelected && 'bg-muted/30')}>
                      {canSelect ? (
                        <TableCell>
                          <input
                            type="checkbox"
                            role="checkbox"
                            aria-label={`Select ${tag.name}`}
                            checked={isSelected}
                            onChange={() => toggleOne(tag.id)}
                            className="h-4 w-4 rounded border-input accent-accent"
                          />
                        </TableCell>
                      ) : null}
                      <TableCell className="font-medium">{tag.name}</TableCell>
                      <TableCell>
                        <code className="text-xs">{tag.slug}</code>
                      </TableCell>
                      <TableCell>{tag.blogPostCount}</TableCell>
                      <TableCell>{tag.projectCount}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" aria-label={`Actions for ${tag.name}`}>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {canWrite ? (
                              <DropdownMenuItem onClick={() => openEdit(tag)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                            ) : null}
                            {canPublish ? (
                              <>
                                <DropdownMenuItem
                                  disabled={isBusy}
                                  onClick={() => handlePublishPosts([tag.id], true)}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  Publish posts
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  disabled={isBusy}
                                  onClick={() => handlePublishPosts([tag.id], false)}
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
                                  onClick={() => openDeleteDialog([tag.id])}
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

      <BulkConfirmDeleteDialog
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        count={deleteTargetIds.length}
        entityLabel={deleteTargetIds.length === 1 ? 'tag' : 'tags'}
        isPending={bulkDeleteMutation.isPending || deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
      />
    </BlogModuleShell>
  );
}
