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
import {
  useCreateKnowledgeBaseEntry,
  useUpdateKnowledgeBaseEntry,
} from '@/features/knowledge-base/hooks/use-knowledge-base-mutations';
import {
  knowledgeBaseFormDefaultValues,
  knowledgeBaseFormSchema,
  toKnowledgeBaseFormValues,
  toKnowledgeBasePayload,
  type KnowledgeBaseFormValues,
} from '@/features/knowledge-base/schemas/knowledge-base.schemas';
import type { KnowledgeBaseEntry } from '@/features/knowledge-base/types/knowledge-base.types';
import { useZodForm } from '@/hooks/use-zod-form';

interface KnowledgeBaseFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry?: KnowledgeBaseEntry | null;
  categories?: string[];
}

export function KnowledgeBaseFormDialog({
  open,
  onOpenChange,
  entry,
  categories = [],
}: KnowledgeBaseFormDialogProps) {
  const createMutation = useCreateKnowledgeBaseEntry();
  const updateMutation = useUpdateKnowledgeBaseEntry();
  const form = useZodForm(knowledgeBaseFormSchema, knowledgeBaseFormDefaultValues);
  const isEditing = Boolean(entry);

  useEffect(() => {
    if (open) {
      form.reset(entry ? toKnowledgeBaseFormValues(entry) : knowledgeBaseFormDefaultValues);
    }
  }, [entry, form, open]);

  const handleSubmit = form.handleSubmit(async (values: KnowledgeBaseFormValues) => {
    const payload = toKnowledgeBasePayload(values);

    if (isEditing && entry) {
      await updateMutation.mutateAsync({ id: entry.id, payload });
    } else {
      await createMutation.mutateAsync(payload);
    }

    onOpenChange(false);
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit entry' : 'New entry'}</DialogTitle>
          <DialogDescription>Knowledge entries power the Ask Ishan AI assistant.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField control={form.control} name="title" label="Title" />
          <FormField
            control={form.control}
            name="category"
            label="Category"
            placeholder={categories[0] ?? 'General'}
          />
          <FormField control={form.control} name="content" label="Content" as="textarea" />
          <FormCheckboxField
            control={form.control}
            name="active"
            label="Active entry"
            description="Inactive entries are excluded from AI context."
          />
          <Button type="submit" variant="accent" disabled={isPending}>
            {isPending ? 'Saving...' : isEditing ? 'Save changes' : 'Create entry'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
