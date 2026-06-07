'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useBulkDeleteProjects } from '@/features/projects/hooks/use-project-mutations';

interface BulkDeleteProjectsDialogProps {
  projectIds: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted?: () => void;
}

export function BulkDeleteProjectsDialog({
  projectIds,
  open,
  onOpenChange,
  onDeleted,
}: BulkDeleteProjectsDialogProps) {
  const deleteMutation = useBulkDeleteProjects();

  const handleDelete = async () => {
    if (projectIds.length === 0) return;
    await deleteMutation.mutateAsync(projectIds);
    onOpenChange(false);
    onDeleted?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {projectIds.length} project(s)</DialogTitle>
          <DialogDescription>
            This will permanently delete the selected projects and their media. This action cannot be
            undone.
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
            {deleteMutation.isPending ? 'Deleting...' : `Delete ${projectIds.length} project(s)`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
