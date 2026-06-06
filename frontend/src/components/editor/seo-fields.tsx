'use client';

import { useMutation } from '@tanstack/react-query';
import { ImagePlus, Loader2, Trash2, Upload } from 'lucide-react';
import Image from 'next/image';
import { useRef } from 'react';
import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form';
import { toast } from 'sonner';

import { FormField } from '@/components/forms/form-field';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { getErrorMessage } from '@/lib/errors';

interface SeoFieldsProps<T extends FieldValues> {
  control: Control<T>;
  titleName: FieldPath<T>;
  descriptionName: FieldPath<T>;
  pageTitle?: string;
}

export function SeoFields<T extends FieldValues>({
  control,
  titleName,
  descriptionName,
  pageTitle,
}: SeoFieldsProps<T>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>SEO metadata</CardTitle>
        <CardDescription>
          Optimize how this {pageTitle ?? 'page'} appears in search engines and social previews.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={control}
          name={titleName}
          label="SEO title"
          placeholder="Custom title for search results (max 70 chars)"
        />
        <FormField
          control={control}
          name={descriptionName}
          label="SEO description"
          as="textarea"
          placeholder="Meta description for search results (max 160 chars)"
        />
      </CardContent>
    </Card>
  );
}

interface FeaturedImageFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  previewUrl?: string | null;
  onUpload: (file: File) => Promise<string>;
  onClear: () => void;
}

export function FeaturedImageField<T extends FieldValues>({
  control,
  name,
  previewUrl,
  onUpload,
  onClear,
}: FeaturedImageFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <FeaturedImageUpload
          previewUrl={previewUrl ?? (field.value as string | null)}
          onUpload={async (file) => {
            const url = await onUpload(file);
            field.onChange(url);
            return url;
          }}
          onClear={() => {
            onClear();
            field.onChange(null);
          }}
        />
      )}
    />
  );
}

interface FeaturedImageUploadProps {
  previewUrl: string | null;
  onUpload: (file: File) => Promise<string>;
  onClear: () => void;
}

function FeaturedImageUpload({ previewUrl, onUpload, onClear }: FeaturedImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useMutation({
    mutationFn: onUpload,
    onError: (error) => toast.error(getErrorMessage(error, 'Upload failed')),
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) uploadMutation.mutate(file);
    event.target.value = '';
  };

  return (
    <div className="space-y-3">
      <Label>Featured image</Label>
      {previewUrl ? (
        <div className="overflow-hidden rounded-lg border">
          <div className="relative aspect-video max-w-md">
            <Image src={previewUrl} alt="Featured" fill className="object-cover" unoptimized />
          </div>
          <div className="flex justify-end border-t p-3">
            <Button type="button" variant="outline" size="sm" onClick={onClear}>
              <Trash2 className="mr-2 h-4 w-4" />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploadMutation.isPending}
          className="flex aspect-video w-full max-w-md flex-col items-center justify-center gap-3 rounded-lg border border-dashed bg-muted/20 p-6"
        >
          {uploadMutation.isPending ? (
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          ) : (
            <ImagePlus className="h-8 w-8 text-muted-foreground" />
          )}
          <p className="text-sm text-muted-foreground">Upload featured image</p>
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      {!previewUrl ? (
        <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()} disabled={uploadMutation.isPending}>
          <Upload className="mr-2 h-4 w-4" />
          Choose file
        </Button>
      ) : null}
    </div>
  );
}
