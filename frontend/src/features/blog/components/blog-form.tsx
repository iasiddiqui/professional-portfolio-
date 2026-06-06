'use client';

import { useEffect } from 'react';
import { Controller, useWatch, type UseFormReturn } from 'react-hook-form';

import { FormCheckboxField } from '@/components/forms/form-checkbox-field';
import { FormField } from '@/components/forms/form-field';
import { FormSelectField } from '@/components/forms/form-select-field';
import { FeaturedImageField, SeoFields } from '@/components/editor';
import { MdxEditor } from '@/components/editor/mdx-editor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { TagSelector } from '@/features/blog/components/tag-selector';
import type { BlogFormValues } from '@/features/blog/schemas/blog.schemas';
import { useBlogCategories, useTags } from '@/features/blog/hooks/use-blog';
import { mediaService } from '@/features/projects/services/media.service';
import { useAuth } from '@/features/auth/providers/auth-provider';
import { MODULE_PERMISSIONS } from '@/constants/permissions';
import { slugify } from '@/utils/string';

interface BlogFormProps {
  form: UseFormReturn<BlogFormValues>;
  onSubmit: (values: BlogFormValues) => Promise<void> | void;
  submitLabel: string;
  isSubmitting?: boolean;
}

export function BlogForm({ form, onSubmit, submitLabel, isSubmitting = false }: BlogFormProps) {
  const { hasPermission } = useAuth();
  const canPublish = hasPermission(MODULE_PERMISSIONS.blog.publish);

  const { data: categories = [] } = useBlogCategories();
  const { data: tags = [] } = useTags();

  const title = useWatch({ control: form.control, name: 'title' });
  const slug = useWatch({ control: form.control, name: 'slug' });
  const tagIds = useWatch({ control: form.control, name: 'tagIds' });
  const featuredImage = useWatch({ control: form.control, name: 'featuredImage' });

  useEffect(() => {
    if (!slug && title) {
      form.setValue('slug', slugify(title), { shouldDirty: true });
    }
  }, [form, slug, title]);

  const categoryOptions = [
    { value: '__none__', label: 'No category' },
    ...categories.map((cat) => ({ value: cat.id, label: cat.name })),
  ];

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
              <CardDescription>Title, excerpt, and MDX content.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField control={form.control} name="title" label="Title" placeholder="My blog post" />
              <FormField control={form.control} name="slug" label="Slug" placeholder="my-blog-post" />
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
                  <MdxEditor
                    value={field.value}
                    onChange={field.onChange}
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
              <FormSelectField
                control={form.control}
                name="categoryId"
                label="Category"
                options={categoryOptions}
                placeholder="Select category"
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
