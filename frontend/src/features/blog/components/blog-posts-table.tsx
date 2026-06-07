'use client';

import { Clock, Eye, EyeOff, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { MediaImage } from '@/components/media/media-image';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
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
import { BlogStatusBadge } from '@/features/blog/components/blog-status-badge';
import type { BlogPost } from '@/features/blog/types/blog.types';
import { ROUTES } from '@/constants/routes';
import { resolveMediaUrl } from '@/lib/media-url';
import { cn } from '@/lib/utils';
import { formatDate } from '@/utils/date';
import { truncate } from '@/utils/string';

interface BlogPostsTableProps {
  posts: BlogPost[];
  canWrite?: boolean;
  canDelete?: boolean;
  canPublish?: boolean;
  selectable?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  onDelete?: (post: BlogPost) => void;
  onPublishToggle?: (post: BlogPost, published: boolean) => void;
  isPublishing?: boolean;
}

export function BlogPostsTable({
  posts,
  canWrite,
  canDelete,
  canPublish,
  selectable = false,
  selectedIds = [],
  onSelectionChange,
  onDelete,
  onPublishToggle,
  isPublishing = false,
}: BlogPostsTableProps) {
  const allSelected = posts.length > 0 && posts.every((post) => selectedIds.includes(post.id));
  const someSelected = posts.some((post) => selectedIds.includes(post.id));

  const toggleAll = () => {
    if (!onSelectionChange) return;

    if (allSelected) {
      const pageIds = new Set(posts.map((post) => post.id));
      onSelectionChange(selectedIds.filter((id) => !pageIds.has(id)));
      return;
    }

    const merged = new Set([...selectedIds, ...posts.map((post) => post.id)]);
    onSelectionChange([...merged]);
  };

  const toggleOne = (postId: string) => {
    if (!onSelectionChange) return;

    if (selectedIds.includes(postId)) {
      onSelectionChange(selectedIds.filter((id) => id !== postId));
    } else {
      onSelectionChange([...selectedIds, postId]);
    }
  };

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            {selectable ? (
              <TableHead className="w-10">
                <input
                  type="checkbox"
                  role="checkbox"
                  aria-label="Select all posts on this page"
                  checked={allSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = someSelected && !allSelected;
                  }}
                  onChange={toggleAll}
                  className="h-4 w-4 rounded border-input accent-accent"
                />
              </TableHead>
            ) : null}
            <TableHead>Post</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Reading time</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead className="w-[70px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => {
            const isSelected = selectedIds.includes(post.id);

            return (
              <TableRow key={post.id} className={cn(isSelected && 'bg-muted/30')}>
                {selectable ? (
                  <TableCell>
                    <input
                      type="checkbox"
                      role="checkbox"
                      aria-label={`Select ${post.title}`}
                      checked={isSelected}
                      onChange={() => toggleOne(post.id)}
                      className="h-4 w-4 rounded border-input accent-accent"
                    />
                  </TableCell>
                ) : null}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-16 overflow-hidden rounded-md bg-muted">
                      {post.featuredImage ? (
                        <MediaImage
                          src={resolveMediaUrl(post.featuredImage)!}
                          alt={post.title}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                          N/A
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <Link href={ROUTES.admin.blogPost(post.id)} className="font-medium hover:text-accent">
                        {post.title}
                      </Link>
                      <p className="truncate text-sm text-muted-foreground">{truncate(post.excerpt, 80)}</p>
                      {post.tags.length > 0 ? (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {post.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag.id} variant="secondary" className="text-xs">
                              {tag.name}
                            </Badge>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <BlogStatusBadge published={post.published} />
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {post.category?.name ?? '—'}
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    {post.readingTimeMinutes} min
                  </span>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{formatDate(post.updatedAt)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" aria-label={`Actions for ${post.title}`}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={ROUTES.admin.blogPost(post.id)}>View details</Link>
                      </DropdownMenuItem>
                      {canWrite ? (
                        <DropdownMenuItem asChild>
                          <Link href={ROUTES.admin.blogEdit(post.id)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                      ) : null}
                      {canPublish ? (
                        <DropdownMenuItem
                          disabled={isPublishing}
                          onClick={() => onPublishToggle?.(post, !post.published)}
                        >
                          {post.published ? (
                            <>
                              <EyeOff className="mr-2 h-4 w-4" />
                              Unpublish
                            </>
                          ) : (
                            <>
                              <Eye className="mr-2 h-4 w-4" />
                              Publish
                            </>
                          )}
                        </DropdownMenuItem>
                      ) : null}
                      {canDelete ? (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => onDelete?.(post)}
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
  );
}
