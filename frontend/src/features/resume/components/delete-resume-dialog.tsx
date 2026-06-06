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
import { useDeleteResume } from '@/features/resume/hooks/use-resume-mutations';
import type { Resume } from '@/features/resume/types/resume.types';

interface DeleteResumeDialogProps {
  resume: Resume | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteResumeDialog({ resume, open, onOpenChange }: DeleteResumeDialogProps) {
  const deleteMutation = useDeleteResume();

  const handleDelete = async () => {
    if (!resume) return;

    await deleteMutation.mutateAsync(resume.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete resume</DialogTitle>
          <DialogDescription>
            This will permanently delete <strong>{resume?.title}</strong> (v{resume?.version}).
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
            {deleteMutation.isPending ? 'Deleting...' : 'Delete resume'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function useDeleteResumeDialog() {
  const [resume, setResume] = useState<Resume | null>(null);
  const [open, setOpen] = useState(false);

  return {
    resume,
    open,
    openDialog: (value: Resume) => {
      setResume(value);
      setOpen(true);
    },
    setOpen,
  };
}
