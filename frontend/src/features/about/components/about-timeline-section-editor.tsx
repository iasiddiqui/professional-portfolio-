'use client';

import { Loader2, Plus, Save, Trash2 } from 'lucide-react';
import { useEffect } from 'react';
import { useFieldArray } from 'react-hook-form';

import { FormCheckboxField } from '@/components/forms/form-checkbox-field';
import { FormField } from '@/components/forms/form-field';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ABOUT_MODULE_CONFIG, getTimelineFieldLabels } from '@/features/about/config/about.config';
import { createEmptyTimelineEntry, serializeTimelineContent } from '@/features/about/lib/about-content';
import {
  aboutTimelineSectionSchema,
  type AboutTimelineSectionFormValues,
} from '@/features/about/schemas/about.schemas';
import {
  useDeleteKnowledgeBaseEntry,
  useUpdateKnowledgeBaseEntry,
} from '@/features/knowledge-base/hooks/use-knowledge-base-mutations';
import type { KnowledgeBaseEntry } from '@/features/knowledge-base/types/knowledge-base.types';
import type { AboutTimelineEntry } from '@/features/about/types/about-content.types';
import { useZodForm } from '@/hooks/use-zod-form';

interface AboutTimelineSectionEditorProps {
  section: KnowledgeBaseEntry;
  entries: AboutTimelineEntry[];
  canWrite: boolean;
  onDeleted?: () => void;
}

export function AboutTimelineSectionEditor({
  section,
  entries,
  canWrite,
  onDeleted,
}: AboutTimelineSectionEditorProps) {
  const updateMutation = useUpdateKnowledgeBaseEntry();
  const deleteMutation = useDeleteKnowledgeBaseEntry();

  const form = useZodForm(aboutTimelineSectionSchema, {
    title: section.title,
    entries: entries.length > 0 ? entries : [createEmptyTimelineEntry()],
    active: section.active,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'entries',
  });

  useEffect(() => {
    form.reset({
      title: section.title,
      entries: entries.length > 0 ? entries : [createEmptyTimelineEntry()],
      active: section.active,
    });
  }, [entries, form, section]);

  const onSubmit = form.handleSubmit(async (values: AboutTimelineSectionFormValues) => {
    await updateMutation.mutateAsync({
      id: section.id,
      payload: {
        title: values.title,
        content: serializeTimelineContent(values.entries),
        category: ABOUT_MODULE_CONFIG.category,
        active: values.active,
      },
    });
  });

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${section.title}" from the About page?`)) return;
    await deleteMutation.mutateAsync(section.id);
    onDeleted?.();
  };

  const isPending = updateMutation.isPending || deleteMutation.isPending;
  const sectionTitle = form.watch('title');
  const labels = getTimelineFieldLabels(sectionTitle || section.title);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle className="text-base">{section.title}</CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">
            Timeline section — each entry has {labels.role.toLowerCase()},{' '}
            {labels.organization.toLowerCase()}, period, and content.
          </p>
        </div>
        {canWrite ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => void handleDelete()}
            disabled={isPending}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        ) : null}
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          <FormField control={form.control} name="title" label="Section title" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Entries</p>
              {canWrite ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append(createEmptyTimelineEntry())}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add entry
                </Button>
              ) : null}
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="space-y-3 rounded-lg border bg-muted/20 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">Entry {index + 1}</p>
                  {canWrite && fields.length > 1 ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => remove(index)}
                    >
                      Remove
                    </Button>
                  ) : null}
                </div>
                <FormField
                  control={form.control}
                  name={`entries.${index}.role`}
                  label={labels.role}
                  placeholder={labels.rolePlaceholder}
                />
                <FormField
                  control={form.control}
                  name={`entries.${index}.organization`}
                  label={labels.organization}
                  placeholder={labels.organizationPlaceholder}
                />
                <FormField
                  control={form.control}
                  name={`entries.${index}.period`}
                  label={labels.period}
                  placeholder={labels.periodPlaceholder}
                />
                <FormField
                  control={form.control}
                  name={`entries.${index}.content`}
                  label="Content"
                  as="textarea"
                  placeholder="One point per line. Bullets are added automatically on the public page."
                />
              </div>
            ))}
          </div>

          <FormCheckboxField
            control={form.control}
            name="active"
            label="Visible on About page"
            description="Inactive sections are hidden from the public site."
          />

          {canWrite ? (
            <Button type="submit" variant="accent" size="sm" disabled={isPending}>
              {updateMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save section
            </Button>
          ) : null}
        </form>
      </CardContent>
    </Card>
  );
}
