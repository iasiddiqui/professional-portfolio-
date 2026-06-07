'use client';

import { Loader2, Save, Trash2 } from 'lucide-react';
import { useEffect } from 'react';

import { FormCheckboxField } from '@/components/forms/form-checkbox-field';
import { FormField } from '@/components/forms/form-field';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ABOUT_MODULE_CONFIG } from '@/features/about/config/about.config';
import { serializeTextContent } from '@/features/about/lib/about-content';
import {
  aboutTextSectionSchema,
  type AboutTextSectionFormValues,
} from '@/features/about/schemas/about.schemas';
import {
  useDeleteKnowledgeBaseEntry,
  useUpdateKnowledgeBaseEntry,
} from '@/features/knowledge-base/hooks/use-knowledge-base-mutations';
import type { KnowledgeBaseEntry } from '@/features/knowledge-base/types/knowledge-base.types';
import { useZodForm } from '@/hooks/use-zod-form';

interface AboutTextSectionEditorProps {
  section: KnowledgeBaseEntry;
  body: string;
  canWrite: boolean;
  onDeleted?: () => void;
}

export function AboutTextSectionEditor({
  section,
  body,
  canWrite,
  onDeleted,
}: AboutTextSectionEditorProps) {
  const updateMutation = useUpdateKnowledgeBaseEntry();
  const deleteMutation = useDeleteKnowledgeBaseEntry();

  const form = useZodForm(aboutTextSectionSchema, {
    title: section.title,
    body,
    active: section.active,
  });

  useEffect(() => {
    form.reset({
      title: section.title,
      body,
      active: section.active,
    });
  }, [body, form, section]);

  const onSubmit = form.handleSubmit(async (values: AboutTextSectionFormValues) => {
    await updateMutation.mutateAsync({
      id: section.id,
      payload: {
        title: values.title,
        content: serializeTextContent(values.body),
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle className="text-base">{section.title}</CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">Text section — paragraphs of content.</p>
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
        <form onSubmit={onSubmit} className="space-y-4">
          <FormField control={form.control} name="title" label="Section title" />
          <FormField
            control={form.control}
            name="body"
            label="Content"
            as="textarea"
            placeholder="Write one or more paragraphs. Separate paragraphs with a blank line."
          />
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
