'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface BulkConfirmDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  count: number;
  entityLabel: string;
  description?: string;
  isPending?: boolean;
  onConfirm: () => void | Promise<void>;
}

export function BulkConfirmDeleteDialog({
  open,
  onOpenChange,
  count,
  entityLabel,
  description,
  isPending = false,
  onConfirm,
}: BulkConfirmDeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Delete {count} {entityLabel}
          </DialogTitle>
          <DialogDescription>
            {description ??
              `This will permanently delete the selected ${entityLabel}. This action cannot be undone.`}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={() => void onConfirm()} disabled={isPending}>
            {isPending ? 'Deleting...' : `Delete ${count} ${entityLabel}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
