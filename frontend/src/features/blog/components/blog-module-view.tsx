'use client';

import { Plus, Search, Tags, FolderOpen } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { EmptyState } from '@/components/common/empty-state';
import { ErrorState } from '@/components/common/error-state';
import { Loader } from '@/components/common/loader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BlogModuleShell } from '@/features/admin/components/module-shells';
import { BlogPostsTable } from '@/features/blog/components/blog-posts-table';
import {
  DeleteBlogPostDialog,
  useDeleteBlogPostDialog,
} from '@/features/blog/components/delete-blog-post-dialog';
import { BLOG_MODULE_CONFIG } from '@/features/blog/config/blog.config';
import { useBlogPosts } from '@/features/blog/hooks/use-blog';
import { MODULE_PERMISSIONS } from '@/constants/permissions';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/features/auth/providers/auth-provider';

export function BlogModuleView() {
  const { hasPermission } = useAuth();
  const canWrite = hasPermission(MODULE_PERMISSIONS.blog.write);
  const canDelete = hasPermission(MODULE_PERMISSIONS.blog.delete);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [publishedFilter, setPublishedFilter] = useState<'ALL' | 'true' | 'false'>('ALL');
  const deleteDialog = useDeleteBlogPostDialog();

  const queryParams = useMemo(
    () => ({
      page,
      limit: BLOG_MODULE_CONFIG.defaultPageSize,
      search: search.trim() || undefined,
      published: publishedFilter === 'ALL' ? undefined : publishedFilter === 'true',
    }),
    [page, publishedFilter, search]
  );

  const { data, isLoading, isError, refetch } = useBlogPosts(queryParams);

  return (
    <BlogModuleShell
      actions={
        <div className="flex flex-wrap items-center gap-2">
          {canWrite ? (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link href={ROUTES.admin.blogCategories}>
                  <FolderOpen className="mr-2 h-4 w-4" />
                  Categories
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href={ROUTES.admin.blogTags}>
                  <Tags className="mr-2 h-4 w-4" />
                  Tags
                </Link>
              </Button>
              <Button variant="accent" size="sm" asChild>
                <Link href={ROUTES.admin.blogNew}>
                  <Plus className="mr-2 h-4 w-4" />
                  New post
                </Link>
              </Button>
            </>
          ) : undefined}
        </div>
      }
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search posts..."
              className="pl-9"
            />
          </div>
          <Select
            value={publishedFilter}
            onValueChange={(value) => {
              setPublishedFilter(value as 'ALL' | 'true' | 'false');
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full lg:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All posts</SelectItem>
              <SelectItem value="true">Published</SelectItem>
              <SelectItem value="false">Drafts</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? <Loader label="Loading blog posts..." /> : null}
        {isError ? (
          <ErrorState title="Failed to load posts" message="Please try again." onRetry={() => void refetch()} />
        ) : null}

        {!isLoading && !isError && data?.items.length === 0 ? (
          <EmptyState
            title="No blog posts yet"
            description="Create your first blog post to get started."
            actionLabel={canWrite ? 'Create post' : undefined}
            onAction={canWrite ? () => (window.location.href = ROUTES.admin.blogNew) : undefined}
          />
        ) : null}

        {!isLoading && !isError && data && data.items.length > 0 ? (
          <>
            <BlogPostsTable
              posts={data.items}
              canWrite={canWrite}
              canDelete={canDelete}
              onDelete={deleteDialog.openDialog}
            />
            <Pagination
              page={data.pagination.page}
              totalPages={data.pagination.totalPages}
              onPageChange={setPage}
            />
          </>
        ) : null}
      </div>

      <DeleteBlogPostDialog
        post={deleteDialog.post}
        open={deleteDialog.open}
        onOpenChange={deleteDialog.setOpen}
      />
    </BlogModuleShell>
  );
}
