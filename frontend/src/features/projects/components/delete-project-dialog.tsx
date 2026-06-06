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
import { useDeleteProject } from '@/features/projects/hooks/use-project-mutations';
import type { Project } from '@/features/projects/types/project.types';

interface DeleteProjectDialogProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted?: () => void;
}

export function DeleteProjectDialog({
  project,
  open,
  onOpenChange,
  onDeleted,
}: DeleteProjectDialogProps) {
  const deleteMutation = useDeleteProject();

  const handleDelete = async () => {
    if (!project) return;

    await deleteMutation.mutateAsync(project.id);
    onOpenChange(false);
    onDeleted?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete project</DialogTitle>
          <DialogDescription>
            This will permanently delete <strong>{project?.title}</strong> and its associated media.
            This action cannot be undone.
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
            {deleteMutation.isPending ? 'Deleting...' : 'Delete project'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function useDeleteProjectDialog() {
  const [project, setProject] = useState<Project | null>(null);
  const [open, setOpen] = useState(false);

  return {
    project,
    open,
    openDialog: (value: Project) => {
      setProject(value);
      setOpen(true);
    },
    setOpen,
  };
}
