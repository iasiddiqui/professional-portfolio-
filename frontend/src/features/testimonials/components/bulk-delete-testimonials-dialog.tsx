'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useBulkDeleteTestimonials } from '@/features/testimonials/hooks/use-testimonial-mutations';

interface BulkDeleteTestimonialsDialogProps {
  testimonialIds: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted?: () => void;
}

export function BulkDeleteTestimonialsDialog({
  testimonialIds,
  open,
  onOpenChange,
  onDeleted,
}: BulkDeleteTestimonialsDialogProps) {
  const deleteMutation = useBulkDeleteTestimonials();

  const handleDelete = async () => {
    if (testimonialIds.length === 0) return;
    await deleteMutation.mutateAsync(testimonialIds);
    onOpenChange(false);
    onDeleted?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {testimonialIds.length} testimonial(s)</DialogTitle>
          <DialogDescription>
            This will permanently delete the selected testimonials. This action cannot be undone.
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
            {deleteMutation.isPending
              ? 'Deleting...'
              : `Delete ${testimonialIds.length} testimonial(s)`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
