'use client';

import { Loader2, Save, Trash2 } from 'lucide-react';
import { useEffect } from 'react';

import { FormCheckboxField } from '@/components/forms/form-checkbox-field';
import { FormField } from '@/components/forms/form-field';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ABOUT_MODULE_CONFIG } from '@/features/about/config/about.config';
import { aboutSectionSchema, type AboutSectionFormValues } from '@/features/about/schemas/about.schemas';
import {
  useDeleteKnowledgeBaseEntry,
  useUpdateKnowledgeBaseEntry,
} from '@/features/knowledge-base/hooks/use-knowledge-base-mutations';
import type { KnowledgeBaseEntry } from '@/features/knowledge-base/types/knowledge-base.types';
import { useZodForm } from '@/hooks/use-zod-form';

interface AboutLegacySectionEditorProps {
  section: KnowledgeBaseEntry;
  canWrite: boolean;
  onDeleted?: () => void;
}

export function AboutLegacySectionEditor({
  section,
  canWrite,
  onDeleted,
}: AboutLegacySectionEditorProps) {
  const updateMutation = useUpdateKnowledgeBaseEntry();
  const deleteMutation = useDeleteKnowledgeBaseEntry();

  const form = useZodForm(aboutSectionSchema, {
    title: section.title,
    content: section.content,
    active: section.active,
  });

  useEffect(() => {
    form.reset({
      title: section.title,
      content: section.content,
      active: section.active,
    });
  }, [form, section]);

  const onSubmit = form.handleSubmit(async (values: AboutSectionFormValues) => {
    await updateMutation.mutateAsync({
      id: section.id,
      payload: {
        title: values.title,
        content: values.content,
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

  if (!canWrite) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{section.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="whitespace-pre-wrap text-sm text-muted-foreground">{section.content}</pre>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle className="text-base">{section.title}</CardTitle>
          <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
            Legacy markdown section — save as timeline or text by recreating the section.
          </p>
        </div>
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
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <FormField control={form.control} name="title" label="Section title" />
          <FormField control={form.control} name="content" label="Content" as="textarea" />
          <FormCheckboxField
            control={form.control}
            name="active"
            label="Visible on About page"
            description="Inactive sections are hidden from the public site."
          />
          <Button type="submit" variant="accent" size="sm" disabled={isPending}>
            {updateMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save section
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
