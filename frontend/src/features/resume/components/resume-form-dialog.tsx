'use client';

import { useEffect } from 'react';
import { Controller, useWatch } from 'react-hook-form';
import { Clock } from 'lucide-react';

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
import { ResumeUploadField } from '@/features/resume/components/resume-upload-field';
import { useCreateResume, useUpdateResume } from '@/features/resume/hooks/use-resume-mutations';
import {
  createResumeFormDefaultValues,
  generateResumeVersion,
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
  const form = useZodForm(resumeFormSchema, createResumeFormDefaultValues());
  const isEditing = Boolean(resume);
  const version = useWatch({ control: form.control, name: 'version' });

  useEffect(() => {
    if (!open) return;

    if (resume) {
      form.reset(toResumeFormValues(resume));
      return;
    }

    form.reset(createResumeFormDefaultValues());
  }, [form, open, resume]);

  const bumpVersion = () => {
    form.setValue('version', generateResumeVersion(), { shouldDirty: true });
  };

  const handleSubmit = form.handleSubmit(async (values: ResumeFormValues) => {
    const payload = toResumePayload({
      ...values,
      version: isEditing ? values.version : generateResumeVersion(),
    });

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
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-xl">
        <DialogHeader className="border-b px-6 py-5">
          <DialogTitle>{isEditing ? 'Edit resume' : 'New resume'}</DialogTitle>
          <DialogDescription>
            Upload a resume file or link an external URL. Version is set automatically from the
            upload time.
          </DialogDescription>
        </DialogHeader>

        <form id="resume-form" onSubmit={handleSubmit} className="space-y-5 px-6 py-5">
          <FormField
            control={form.control}
            name="title"
            label="Title"
            placeholder="Software Engineer Resume"
          />

          <Controller
            control={form.control}
            name="fileUrl"
            render={({ field, fieldState }) => (
              <ResumeUploadField
                key={resume?.id ?? 'new'}
                value={field.value}
                onChange={field.onChange}
                onUploadSuccess={bumpVersion}
                initialUseExternalUrl={Boolean(
                  resume?.fileUrl && !resume.fileUrl.includes('/uploads/')
                )}
                error={fieldState.error?.message}
              />
            )}
          />

          <input type="hidden" {...form.register('version')} />

          <div className="flex items-center gap-2 rounded-lg border bg-muted/20 px-3 py-2.5 text-sm">
            <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Version</p>
              <p className="truncate font-medium">{version || generateResumeVersion()}</p>
            </div>
          </div>

          <FormCheckboxField
            control={form.control}
            name="isActive"
            label="Set as active"
            description="Only one resume can be active. Visitors download the active version from your site."
          />

          <div className="-mx-6 -mb-5 flex justify-end gap-2 border-t bg-muted/20 px-6 py-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="accent" disabled={isPending}>
              {isPending ? 'Saving...' : isEditing ? 'Save changes' : 'Create resume'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
