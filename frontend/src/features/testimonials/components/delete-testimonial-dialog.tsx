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
import { useDeleteTestimonial } from '@/features/testimonials/hooks/use-testimonial-mutations';
import type { Testimonial } from '@/features/testimonials/types/testimonial.types';

interface DeleteTestimonialDialogProps {
  testimonial: Testimonial | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteTestimonialDialog({
  testimonial,
  open,
  onOpenChange,
}: DeleteTestimonialDialogProps) {
  const deleteMutation = useDeleteTestimonial();

  const handleDelete = async () => {
    if (!testimonial) return;

    await deleteMutation.mutateAsync(testimonial.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete testimonial</DialogTitle>
          <DialogDescription>
            This will permanently delete the testimonial from <strong>{testimonial?.clientName}</strong>.
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
            {deleteMutation.isPending ? 'Deleting...' : 'Delete testimonial'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function useDeleteTestimonialDialog() {
  const [testimonial, setTestimonial] = useState<Testimonial | null>(null);
  const [open, setOpen] = useState(false);

  return {
    testimonial,
    open,
    openDialog: (value: Testimonial) => {
      setTestimonial(value);
      setOpen(true);
    },
    setOpen,
  };
}
