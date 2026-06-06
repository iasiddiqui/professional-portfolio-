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
import { useDeleteKnowledgeBaseEntry } from '@/features/knowledge-base/hooks/use-knowledge-base-mutations';
import type { KnowledgeBaseEntry } from '@/features/knowledge-base/types/knowledge-base.types';

interface DeleteKnowledgeBaseDialogProps {
  entry: KnowledgeBaseEntry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteKnowledgeBaseDialog({ entry, open, onOpenChange }: DeleteKnowledgeBaseDialogProps) {
  const deleteMutation = useDeleteKnowledgeBaseEntry();

  const handleDelete = async () => {
    if (!entry) return;

    await deleteMutation.mutateAsync(entry.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete knowledge base entry</DialogTitle>
          <DialogDescription>
            This will permanently delete <strong>{entry?.title}</strong>.
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
            {deleteMutation.isPending ? 'Deleting...' : 'Delete entry'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function useDeleteKnowledgeBaseDialog() {
  const [entry, setEntry] = useState<KnowledgeBaseEntry | null>(null);
  const [open, setOpen] = useState(false);

  return {
    entry,
    open,
    openDialog: (value: KnowledgeBaseEntry) => {
      setEntry(value);
      setOpen(true);
    },
    setOpen,
  };
}
