'use client';

import { useEffect, useMemo, useState } from 'react';
import { useWatch, type UseFormReturn } from 'react-hook-form';

import { FormCheckboxField } from '@/components/forms/form-checkbox-field';
import { FormField } from '@/components/forms/form-field';
import { FormSelectField } from '@/components/forms/form-select-field';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PROJECT_STATUS_OPTIONS } from '@/features/projects/config/project.config';
import { GalleryUploadField, ImageUploadField } from '@/features/projects/components/image-upload-field';
import type { ProjectFormValues } from '@/features/projects/schemas/project.schemas';
import type { ProjectMedia } from '@/features/projects/types/project.types';
import { useAuth } from '@/features/auth/providers/auth-provider';
import { MODULE_PERMISSIONS } from '@/constants/permissions';
import { slugify } from '@/utils/string';

interface ProjectFormProps {
  form: UseFormReturn<ProjectFormValues>;
  onSubmit: (values: ProjectFormValues) => Promise<void> | void;
  submitLabel: string;
  isSubmitting?: boolean;
  initialThumbnail?: ProjectMedia | null;
  initialGallery?: ProjectMedia[];
}

export function ProjectForm({
  form,
  onSubmit,
  submitLabel,
  isSubmitting = false,
  initialThumbnail = null,
  initialGallery = [],
}: ProjectFormProps) {
  const { hasPermission } = useAuth();
  const canPublish = hasPermission(MODULE_PERMISSIONS.projects.publish);

  const [thumbnailPreview, setThumbnailPreview] = useState<ProjectMedia | null>(initialThumbnail);
  const [galleryPreview, setGalleryPreview] = useState<ProjectMedia[]>(initialGallery);

  const title = useWatch({ control: form.control, name: 'title' });
  const slug = useWatch({ control: form.control, name: 'slug' });

  useEffect(() => {
    setThumbnailPreview(initialThumbnail);
    setGalleryPreview(initialGallery);
  }, [initialGallery, initialThumbnail]);

  useEffect(() => {
    if (!slug && title) {
      form.setValue('slug', slugify(title), { shouldDirty: true });
    }
  }, [form, slug, title]);

  const statusOptions = useMemo(
    () =>
      canPublish
        ? PROJECT_STATUS_OPTIONS
        : PROJECT_STATUS_OPTIONS.filter((option) => option.value !== 'PUBLISHED'),
    [canPublish]
  );

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit({
      ...values,
      thumbnailMediaId: thumbnailPreview?.id ?? null,
      galleryMediaIds: galleryPreview.map((item) => item.id),
    });
  });

  const markMediaForRemoval = (mediaId: string) => {
    const current = form.getValues('removeMediaIds') ?? [];
    if (!current.includes(mediaId)) {
      form.setValue('removeMediaIds', [...current, mediaId], { shouldDirty: true });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project details</CardTitle>
              <CardDescription>Core information shown on the portfolio project page.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField control={form.control} name="title" label="Title" placeholder="Portfolio platform" />
              <FormField
                control={form.control}
                name="slug"
                label="Slug"
                placeholder="portfolio-platform"
              />
              <FormField
                control={form.control}
                name="shortDescription"
                label="Short description"
                placeholder="A concise summary for cards and listings"
              />
              <FormField
                control={form.control}
                name="description"
                label="Full description"
                as="textarea"
                placeholder="Detailed overview of the project"
              />
              <FormField
                control={form.control}
                name="techStackInput"
                label="Tech stack"
                placeholder="Next.js, TypeScript, PostgreSQL, Prisma"
              />
              <FormField
                control={form.control}
                name="architecture"
                label="Architecture"
                as="textarea"
                placeholder="Describe the system architecture and key design decisions"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Links</CardTitle>
              <CardDescription>Optional external links for repository and live demo.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <FormField control={form.control} name="githubUrl" label="GitHub URL" placeholder="https://github.com/..." />
              <FormField control={form.control} name="liveUrl" label="Live URL" placeholder="https://example.com" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Media</CardTitle>
              <CardDescription>Upload a thumbnail and optional gallery images.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ImageUploadField
                label="Thumbnail"
                description="Primary image used in listings and cards."
                value={thumbnailPreview}
                onChange={setThumbnailPreview}
                onRemoveExisting={markMediaForRemoval}
              />
              <GalleryUploadField
                label="Gallery images"
                description="Additional screenshots or visuals."
                items={galleryPreview}
                onAdd={(media) => setGalleryPreview((current) => [...current, media])}
                onRemove={(mediaId) => {
                  markMediaForRemoval(mediaId);
                  setGalleryPreview((current) => current.filter((item) => item.id !== mediaId));
                }}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Publishing</CardTitle>
              <CardDescription>Control visibility and featured placement.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormSelectField
                control={form.control}
                name="status"
                label="Status"
                options={statusOptions}
              />
              <FormCheckboxField
                control={form.control}
                name="featured"
                label="Featured project"
                description="Highlight this project on the homepage and featured sections."
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <Button type="submit" variant="accent" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : submitLabel}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
