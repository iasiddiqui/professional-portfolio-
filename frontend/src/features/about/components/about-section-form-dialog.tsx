'use client';

import { useEffect, useState } from 'react';
import { useFieldArray } from 'react-hook-form';

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
import { Label } from '@/components/ui/label';
import { ABOUT_MODULE_CONFIG, getTimelineFieldLabels } from '@/features/about/config/about.config';
import {
  createEmptyTimelineEntry,
  serializeTextContent,
  serializeTimelineContent,
} from '@/features/about/lib/about-content';
import {
  aboutTextSectionSchema,
  aboutTimelineSectionSchema,
  type AboutTextSectionFormValues,
  type AboutTimelineSectionFormValues,
} from '@/features/about/schemas/about.schemas';
import type { AboutContentFormat } from '@/features/about/types/about-content.types';
import { useCreateKnowledgeBaseEntry } from '@/features/knowledge-base/hooks/use-knowledge-base-mutations';
import { useZodForm } from '@/hooks/use-zod-form';

interface AboutSectionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AboutSectionFormDialog({ open, onOpenChange }: AboutSectionFormDialogProps) {
  const [format, setFormat] = useState<AboutContentFormat>('timeline');
  const createMutation = useCreateKnowledgeBaseEntry();

  const textForm = useZodForm(aboutTextSectionSchema, {
    title: '',
    body: '',
    active: true,
  });

  const timelineForm = useZodForm(aboutTimelineSectionSchema, {
    title: '',
    entries: [createEmptyTimelineEntry()],
    active: true,
  });

  const { fields, append, remove } = useFieldArray({
    control: timelineForm.control,
    name: 'entries',
  });

  useEffect(() => {
    if (!open) return;
    setFormat('timeline');
    textForm.reset({ title: '', body: '', active: true });
    timelineForm.reset({ title: '', entries: [createEmptyTimelineEntry()], active: true });
  }, [open, textForm, timelineForm]);

  const handleTextSubmit = textForm.handleSubmit(async (values: AboutTextSectionFormValues) => {
    await createMutation.mutateAsync({
      title: values.title,
      content: serializeTextContent(values.body),
      category: ABOUT_MODULE_CONFIG.category,
      active: values.active,
    });
    onOpenChange(false);
  });

  const handleTimelineSubmit = timelineForm.handleSubmit(
    async (values: AboutTimelineSectionFormValues) => {
      await createMutation.mutateAsync({
        title: values.title,
        content: serializeTimelineContent(values.entries),
        category: ABOUT_MODULE_CONFIG.category,
        active: values.active,
      });
      onOpenChange(false);
    }
  );

  const isPending = createMutation.isPending;
  const sectionTitle = timelineForm.watch('title');
  const labels = getTimelineFieldLabels(sectionTitle);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add About section</DialogTitle>
          <DialogDescription>
            Choose a text block or a timeline for experience, education, or certifications.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label>Section type</Label>
          <div className="inline-flex rounded-lg border p-1">
            <Button
              type="button"
              size="sm"
              variant={format === 'timeline' ? 'default' : 'ghost'}
              onClick={() => setFormat('timeline')}
            >
              Timeline
            </Button>
            <Button
              type="button"
              size="sm"
              variant={format === 'text' ? 'default' : 'ghost'}
              onClick={() => setFormat('text')}
            >
              Text
            </Button>
          </div>
        </div>

        {format === 'text' ? (
          <form onSubmit={handleTextSubmit} className="space-y-4">
            <FormField control={textForm.control} name="title" label="Section title" />
            <FormField
              control={textForm.control}
              name="body"
              label="Content"
              as="textarea"
              placeholder="Write one or more paragraphs."
            />
            <FormCheckboxField control={textForm.control} name="active" label="Visible on About page" />
            <Button type="submit" variant="accent" disabled={isPending}>
              {isPending ? 'Creating...' : 'Create section'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleTimelineSubmit} className="space-y-4">
            <FormField control={timelineForm.control} name="title" label="Section title" />
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="space-y-3 rounded-lg border bg-muted/20 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-muted-foreground">Entry {index + 1}</p>
                    {fields.length > 1 ? (
                      <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)}>
                        Remove
                      </Button>
                    ) : null}
                  </div>
                  <FormField
                    control={timelineForm.control}
                    name={`entries.${index}.role`}
                    label={labels.role}
                    placeholder={labels.rolePlaceholder}
                  />
                  <FormField
                    control={timelineForm.control}
                    name={`entries.${index}.organization`}
                    label={labels.organization}
                    placeholder={labels.organizationPlaceholder}
                  />
                  <FormField
                    control={timelineForm.control}
                    name={`entries.${index}.period`}
                    label={labels.period}
                    placeholder={labels.periodPlaceholder}
                  />
                  <FormField
                    control={timelineForm.control}
                    name={`entries.${index}.content`}
                    label="Content"
                    as="textarea"
                    placeholder="One point per line."
                  />
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append(createEmptyTimelineEntry())}
              >
                Add entry
              </Button>
            </div>
            <FormCheckboxField
              control={timelineForm.control}
              name="active"
              label="Visible on About page"
            />
            <Button type="submit" variant="accent" disabled={isPending}>
              {isPending ? 'Creating...' : 'Create section'}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
