'use client';

import { Controller, useWatch, type UseFormReturn } from 'react-hook-form';

import type { ContentFormat } from '@/features/blog/types/blog.types';

import { FormCheckboxField } from '@/components/forms/form-checkbox-field';
import { FormField } from '@/components/forms/form-field';
import { FeaturedImageField, SeoFields, BlogContentEditor } from '@/components/editor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { CategorySelector } from '@/features/blog/components/category-selector';
import { TagSelector } from '@/features/blog/components/tag-selector';
import type { BlogFormValues } from '@/features/blog/schemas/blog.schemas';
import { useBlogCategories, useTags } from '@/features/blog/hooks/use-blog';
import { mediaService } from '@/features/projects/services/media.service';
import { useAuth } from '@/features/auth/providers/auth-provider';
import { MODULE_PERMISSIONS } from '@/constants/permissions';
import { useAutoSlugSync } from '@/hooks/use-auto-slug-sync';

interface BlogFormProps {
  form: UseFormReturn<BlogFormValues>;
  onSubmit: (values: BlogFormValues) => Promise<void> | void;
  submitLabel: string;
  isSubmitting?: boolean;
  syncSlugFromTitle?: boolean;
}

export function BlogForm({ form, onSubmit, submitLabel, isSubmitting = false, syncSlugFromTitle = true }: BlogFormProps) {
  const { hasPermission } = useAuth();
  const canPublish = hasPermission(MODULE_PERMISSIONS.blog.publish);

  const { data: categories = [] } = useBlogCategories();
  const { data: tags = [] } = useTags();

  const title = useWatch({ control: form.control, name: 'title' });
  const contentFormat = useWatch({ control: form.control, name: 'contentFormat' }) as ContentFormat;
  const { markSlugManual } = useAutoSlugSync(form, { title, enabled: syncSlugFromTitle });
  const tagIds = useWatch({ control: form.control, name: 'tagIds' });
  const featuredImage = useWatch({ control: form.control, name: 'featuredImage' });

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values);
  });

  const uploadFeaturedImage = async (file: File) => {
    const media = await mediaService.upload(file);
    return media.url;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Post details</CardTitle>
              <CardDescription>Title, excerpt, and post content.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField control={form.control} name="title" label="Title" placeholder="My blog post" />
              <FormField
                control={form.control}
                name="slug"
                label="Slug"
                placeholder="my-blog-post"
                onValueChange={markSlugManual}
              />
              <FormField
                control={form.control}
                name="excerpt"
                label="Excerpt"
                as="textarea"
                placeholder="Short summary for listings and SEO"
              />
              <Controller
                control={form.control}
                name="content"
                render={({ field, fieldState }) => (
                  <BlogContentEditor
                    value={field.value}
                    contentFormat={contentFormat}
                    onChange={field.onChange}
                    onContentFormatChange={(format) =>
                      form.setValue('contentFormat', format, { shouldDirty: true })
                    }
                    error={fieldState.error?.message}
                  />
                )}
              />
            </CardContent>
          </Card>

          <SeoFields
            control={form.control}
            titleName="seoTitle"
            descriptionName="seoDescription"
            pageTitle="blog post"
          />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Publishing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {canPublish ? (
                <FormCheckboxField
                  control={form.control}
                  name="published"
                  label="Published"
                  description="Make this post visible on the public blog when published."
                />
              ) : (
                <p className="text-sm text-muted-foreground">Draft only — publish permission required.</p>
              )}
              <Controller
                control={form.control}
                name="categoryId"
                render={({ field, fieldState }) => (
                  <CategorySelector
                    categories={categories}
                    value={field.value}
                    onChange={field.onChange}
                    error={fieldState.error?.message}
                  />
                )}
              />
              <div className="space-y-2">
                <Label>Tags</Label>
                <TagSelector
                  tags={tags}
                  selectedIds={tagIds ?? []}
                  onChange={(ids) => form.setValue('tagIds', ids, { shouldDirty: true })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Featured image</CardTitle>
            </CardHeader>
            <CardContent>
              <FeaturedImageField
                control={form.control}
                name="featuredImage"
                previewUrl={featuredImage}
                onUpload={uploadFeaturedImage}
                onClear={() => undefined}
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
