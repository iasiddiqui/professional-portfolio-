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
import { useSetResumeActive } from '@/features/resume/hooks/use-resume-mutations';
import type { Resume } from '@/features/resume/types/resume.types';

interface ActivateResumeDialogState {
  target: Resume;
  currentActive: Resume;
}

interface ActivateResumeDialogProps {
  state: ActivateResumeDialogState | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ActivateResumeDialog({ state, open, onOpenChange }: ActivateResumeDialogProps) {
  const activeMutation = useSetResumeActive();

  const handleConfirm = async () => {
    if (!state) return;

    await activeMutation.mutateAsync({ id: state.target.id, isActive: true });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change active resume</DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-3 pt-1 text-sm text-muted-foreground">
              <p>
                Only one resume can be active at a time.{' '}
                <strong className="text-foreground">{state?.currentActive.title}</strong> is currently
                active and will be set to <strong className="text-foreground">inactive</strong> first.
              </p>
              <p>
                Then <strong className="text-foreground">{state?.target.title}</strong> will become the
                active resume on your public site.
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="accent" onClick={() => void handleConfirm()} disabled={activeMutation.isPending}>
            {activeMutation.isPending ? 'Updating...' : 'Set as active'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function useActivateResumeDialog() {
  const [state, setState] = useState<ActivateResumeDialogState | null>(null);
  const [open, setOpen] = useState(false);

  return {
    state,
    open,
    openDialog: (value: ActivateResumeDialogState) => {
      setState(value);
      setOpen(true);
    },
    setOpen,
  };
}
