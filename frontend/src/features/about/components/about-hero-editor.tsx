'use client';

import { ExternalLink, Loader2, Save } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

import { FormField } from '@/components/forms/form-field';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { aboutHeroSchema, type AboutHeroFormValues } from '@/features/about/schemas/about.schemas';
import { useUpdateSettings } from '@/features/settings/hooks/use-settings-mutations';
import { ROUTES } from '@/constants/routes';
import { useZodForm } from '@/hooks/use-zod-form';

interface AboutHeroEditorProps {
  siteDescription: string;
  canWrite: boolean;
}

export function AboutHeroEditor({ siteDescription, canWrite }: AboutHeroEditorProps) {
  const updateMutation = useUpdateSettings();
  const form = useZodForm(aboutHeroSchema, { siteDescription });

  useEffect(() => {
    form.reset({ siteDescription });
  }, [form, siteDescription]);

  const onSubmit = form.handleSubmit(async (values: AboutHeroFormValues) => {
    await updateMutation.mutateAsync({ siteDescription: values.siteDescription });
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>Page intro</CardTitle>
          <CardDescription>
            Shown under the hero title on the public About page. Experience and education sections
            appear below.
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.about} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            Preview
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {canWrite ? (
          <form onSubmit={onSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="siteDescription"
              label="Intro paragraph"
              as="textarea"
            />
            <Button type="submit" variant="accent" size="sm" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save intro
            </Button>
          </form>
        ) : (
          <p className="whitespace-pre-wrap text-sm text-muted-foreground">{siteDescription}</p>
        )}
      </CardContent>
    </Card>
  );
}
