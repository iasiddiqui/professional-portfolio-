'use client';

import { Clock, Pencil, Trash2 } from 'lucide-react';
import { MediaImage } from '@/components/media/media-image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { ErrorState } from '@/components/common/error-state';
import { Loader } from '@/components/common/loader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BlogModuleShell } from '@/features/admin/components/module-shells';
import { BlogStatusBadge } from '@/features/blog/components/blog-status-badge';
import {
  DeleteBlogPostDialog,
  useDeleteBlogPostDialog,
} from '@/features/blog/components/delete-blog-post-dialog';
import { usePublishBlogPost } from '@/features/blog/hooks/use-blog-mutations';
import { useBlogPost } from '@/features/blog/hooks/use-blog';
import { MODULE_PERMISSIONS } from '@/constants/permissions';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/features/auth/providers/auth-provider';
import { formatDateTime } from '@/utils/date';
import { ContentRenderer } from '@/features/public/components/content-renderer';
import { resolveMediaUrl } from '@/lib/media-url';

interface BlogPostDetailsViewProps {
  postId: string;
}

export function BlogPostDetailsView({ postId }: BlogPostDetailsViewProps) {
  const router = useRouter();
  const { hasPermission } = useAuth();
  const canWrite = hasPermission(MODULE_PERMISSIONS.blog.write);
  const canDelete = hasPermission(MODULE_PERMISSIONS.blog.delete);
  const canPublish = hasPermission(MODULE_PERMISSIONS.blog.publish);

  const deleteDialog = useDeleteBlogPostDialog();
  const publishMutation = usePublishBlogPost(postId);
  const { data: post, isLoading, isError, refetch } = useBlogPost(postId);

  if (isLoading) {
    return (
      <BlogModuleShell title="Blog post">
        <Loader label="Loading post..." />
      </BlogModuleShell>
    );
  }

  if (isError || !post) {
    return (
      <BlogModuleShell title="Blog post">
        <ErrorState title="Post not found" onRetry={() => void refetch()} />
      </BlogModuleShell>
    );
  }

  return (
    <BlogModuleShell
      title={post.title}
      description={post.excerpt}
      breadcrumbs={[
        { label: 'Dashboard', href: ROUTES.admin.dashboard },
        { label: 'Blog', href: ROUTES.admin.blog },
        { label: post.title },
      ]}
      actions={
        <div className="flex flex-wrap items-center gap-2">
          {canPublish ? (
            <Button
              variant="outline"
              size="sm"
              disabled={publishMutation.isPending}
              onClick={() => publishMutation.mutate(!post.published)}
            >
              {post.published ? 'Unpublish' : 'Publish'}
            </Button>
          ) : null}
          {canWrite ? (
            <Button variant="outline" size="sm" asChild>
              <Link href={ROUTES.admin.blogEdit(post.id)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
          ) : null}
          {canDelete ? (
            <Button variant="destructive" size="sm" onClick={() => deleteDialog.openDialog(post)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          ) : null}
        </div>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <div className="space-y-6">
          {post.featuredImage ? (
            <Card className="overflow-hidden">
              <div className="relative aspect-[16/9]">
                <MediaImage
                  src={resolveMediaUrl(post.featuredImage)!}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1280px) 100vw, 66vw"
                  priority
                />
              </div>
            </Card>
          ) : null}

          <Card>
            <CardHeader>
              <CardTitle>Content preview</CardTitle>
            </CardHeader>
            <CardContent>
              <ContentRenderer
                content={post.content}
                contentFormat={post.contentFormat}
                className="max-h-[480px] overflow-auto rounded-lg bg-muted/40 p-4"
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Status</span>
                <BlogStatusBadge published={post.published} />
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Reading time</span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {post.readingTimeMinutes} min
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Format</span>
                <Badge variant="secondary">{post.contentFormat}</Badge>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Slug</span>
                <code className="rounded bg-muted px-2 py-1 text-xs">{post.slug}</code>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Updated</span>
                <span>{formatDateTime(post.updatedAt)}</span>
              </div>
              {post.publishedAt ? (
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Published</span>
                  <span>{formatDateTime(post.publishedAt)}</span>
                </div>
              ) : null}
            </CardContent>
          </Card>

          {(post.seoTitle || post.seoDescription) && (
            <Card>
              <CardHeader>
                <CardTitle>SEO</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {post.seoTitle ? (
                  <div>
                    <p className="text-muted-foreground">Title</p>
                    <p>{post.seoTitle}</p>
                  </div>
                ) : null}
                {post.seoDescription ? (
                  <div>
                    <p className="text-muted-foreground">Description</p>
                    <p>{post.seoDescription}</p>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Taxonomy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="mb-1 text-sm text-muted-foreground">Category</p>
                <p className="text-sm">{post.category?.name ?? 'None'}</p>
              </div>
              <div>
                <p className="mb-2 text-sm text-muted-foreground">Tags</p>
                <div className="flex flex-wrap gap-1">
                  {post.tags.length > 0 ? (
                    post.tags.map((tag) => (
                      <Badge key={tag.id} variant="secondary">
                        {tag.name}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">No tags</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <DeleteBlogPostDialog
        post={deleteDialog.post}
        open={deleteDialog.open}
        onOpenChange={deleteDialog.setOpen}
        onDeleted={() => router.push(ROUTES.admin.blog)}
      />
    </BlogModuleShell>
  );
}
