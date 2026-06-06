'use client';

import { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useDeleteBlogPost } from '@/features/blog/hooks/use-blog-mutations';
import type { BlogPost } from '@/features/blog/types/blog.types';

interface DeleteBlogPostDialogProps {
  post: BlogPost | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted?: () => void;
}

export function DeleteBlogPostDialog({
  post,
  open,
  onOpenChange,
  onDeleted,
}: DeleteBlogPostDialogProps) {
  const deleteMutation = useDeleteBlogPost();

  const handleDelete = async () => {
    if (!post) return;
    await deleteMutation.mutateAsync(post.id);
    onOpenChange(false);
    onDeleted?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete blog post</DialogTitle>
          <DialogDescription>
            This will permanently delete <strong>{post?.title}</strong>. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={() => void handleDelete()} disabled={deleteMutation.isPending}>
            {deleteMutation.isPending ? 'Deleting...' : 'Delete post'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function useDeleteBlogPostDialog() {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [open, setOpen] = useState(false);

  return {
    post,
    open,
    openDialog: (value: BlogPost) => {
      setPost(value);
      setOpen(true);
    },
    setOpen,
  };
}
