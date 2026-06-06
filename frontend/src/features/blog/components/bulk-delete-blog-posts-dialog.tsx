'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useBulkDeleteBlogPosts } from '@/features/blog/hooks/use-blog-mutations';

interface BulkDeleteBlogPostsDialogProps {
  postIds: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted?: () => void;
}

export function BulkDeleteBlogPostsDialog({
  postIds,
  open,
  onOpenChange,
  onDeleted,
}: BulkDeleteBlogPostsDialogProps) {
  const deleteMutation = useBulkDeleteBlogPosts();

  const handleDelete = async () => {
    if (postIds.length === 0) return;
    await deleteMutation.mutateAsync(postIds);
    onOpenChange(false);
    onDeleted?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {postIds.length} blog post(s)</DialogTitle>
          <DialogDescription>
            This will permanently delete the selected posts. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => void handleDelete()}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Deleting...' : `Delete ${postIds.length} post(s)`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
