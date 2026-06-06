'use client';

import { useEffect } from 'react';

import { FormCheckboxField } from '@/components/forms/form-checkbox-field';
import { FormField } from '@/components/forms/form-field';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useCreateResume, useUpdateResume } from '@/features/resume/hooks/use-resume-mutations';
import {
  resumeFormDefaultValues,
  resumeFormSchema,
  toResumeFormValues,
  toResumePayload,
  type ResumeFormValues,
} from '@/features/resume/schemas/resume.schemas';
import type { Resume } from '@/features/resume/types/resume.types';
import { useZodForm } from '@/hooks/use-zod-form';

interface ResumeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resume?: Resume | null;
}

export function ResumeFormDialog({ open, onOpenChange, resume }: ResumeFormDialogProps) {
  const createMutation = useCreateResume();
  const updateMutation = useUpdateResume();
  const form = useZodForm(resumeFormSchema, resumeFormDefaultValues);
  const isEditing = Boolean(resume);

  useEffect(() => {
    if (open) {
      form.reset(resume ? toResumeFormValues(resume) : resumeFormDefaultValues);
    }
  }, [form, open, resume]);

  const handleSubmit = form.handleSubmit(async (values: ResumeFormValues) => {
    const payload = toResumePayload(values);

    if (isEditing && resume) {
      await updateMutation.mutateAsync({ id: resume.id, payload });
    } else {
      await createMutation.mutateAsync(payload);
    }

    onOpenChange(false);
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit resume' : 'New resume'}</DialogTitle>
          <DialogDescription>Upload a resume version for public download.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField control={form.control} name="title" label="Title" placeholder="Software Engineer Resume" />
          <FormField
            control={form.control}
            name="fileUrl"
            label="File URL"
            placeholder="https://example.com/resume.pdf"
          />
          <FormField control={form.control} name="version" label="Version" placeholder="2025.06" />
          <FormCheckboxField
            control={form.control}
            name="isActive"
            label="Set as active"
            description="Only one resume can be active at a time. Use activate action to switch versions."
          />
          <Button type="submit" variant="accent" disabled={isPending}>
            {isPending ? 'Saving...' : isEditing ? 'Save changes' : 'Create resume'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
