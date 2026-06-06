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
import { useDeleteLead } from '@/features/leads/hooks/use-lead-mutations';
import type { Lead } from '@/features/leads/types/lead.types';

interface DeleteLeadDialogProps {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted?: () => void;
}

export function DeleteLeadDialog({ lead, open, onOpenChange, onDeleted }: DeleteLeadDialogProps) {
  const deleteMutation = useDeleteLead();

  const handleDelete = async () => {
    if (!lead) return;
    await deleteMutation.mutateAsync(lead.id);
    onOpenChange(false);
    onDeleted?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete lead</DialogTitle>
          <DialogDescription>
            Permanently delete the lead from <strong>{lead?.name}</strong>?
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={() => void handleDelete()} disabled={deleteMutation.isPending}>
            {deleteMutation.isPending ? 'Deleting...' : 'Delete lead'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function useDeleteLeadDialog() {
  const [lead, setLead] = useState<Lead | null>(null);
  const [open, setOpen] = useState(false);

  return {
    lead,
    open,
    openDialog: (value: Lead) => {
      setLead(value);
      setOpen(true);
    },
    setOpen,
  };
}
