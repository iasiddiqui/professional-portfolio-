'use client';

import { useMutation } from '@tanstack/react-query';
import { ImagePlus, Loader2, Trash2, Upload } from 'lucide-react';
import Image from 'next/image';
import { useRef } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { mediaService } from '@/features/projects/services/media.service';
import type { ProjectMedia } from '@/features/projects/types/project.types';
import { getErrorMessage } from '@/lib/errors';
import { resolveMediaUrl } from '@/lib/media-url';
import { cn } from '@/lib/utils';

interface ImageUploadFieldProps {
  label: string;
  description?: string;
  value: ProjectMedia | null;
  onChange: (media: ProjectMedia | null) => void;
  onRemoveExisting?: (mediaId: string) => void;
  className?: string;
}

export function ImageUploadField({
  label,
  description,
  value,
  onChange,
  onRemoveExisting,
  className,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useMutation({
    mutationFn: (file: File) => mediaService.upload(file, { isThumbnail: true }),
    onSuccess: (media) => onChange(media),
    onError: (error) => toast.error(getErrorMessage(error, 'Upload failed')),
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadMutation.mutate(file);
    }
    event.target.value = '';
  };

  const handleRemove = () => {
    if (value && onRemoveExisting) {
      onRemoveExisting(value.id);
    }
    onChange(null);
  };

  return (
    <div className={cn('space-y-3', className)}>
      <div>
        <Label>{label}</Label>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>

      {value ? (
        <div className="relative overflow-hidden rounded-lg border bg-muted/30">
          <div className="relative aspect-video w-full max-w-sm">
            <Image
              src={resolveMediaUrl(value.url)!}
              alt={value.alt ?? label}
              fill
              className="object-cover"
              sizes="384px"
            />
          </div>
          <div className="flex items-center justify-between gap-2 border-t p-3">
            <p className="truncate text-sm text-muted-foreground">{value.filename}</p>
            <Button type="button" variant="outline" size="sm" onClick={handleRemove}>
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
          className="flex aspect-video w-full max-w-sm flex-col items-center justify-center gap-3 rounded-lg border border-dashed bg-muted/20 p-6 text-center transition-colors hover:border-accent/50 hover:bg-muted/40"
        >
          {uploadMutation.isPending ? (
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          ) : (
            <ImagePlus className="h-8 w-8 text-muted-foreground" />
          )}
          <div>
            <p className="font-medium">Upload thumbnail</p>
            <p className="text-sm text-muted-foreground">PNG, JPG, WEBP up to 5MB</p>
          </div>
        </button>
      )}

      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

      {!value ? (
        <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()} disabled={uploadMutation.isPending}>
          <Upload className="mr-2 h-4 w-4" />
          Choose file
        </Button>
      ) : null}
    </div>
  );
}

interface GalleryUploadFieldProps {
  label: string;
  description?: string;
  items: ProjectMedia[];
  onAdd: (media: ProjectMedia) => void;
  onRemove: (mediaId: string) => void;
  className?: string;
}

export function GalleryUploadField({
  label,
  description,
  items,
  onAdd,
  onRemove,
  className,
}: GalleryUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useMutation({
    mutationFn: (file: File) => mediaService.upload(file),
    onSuccess: (media) => onAdd(media),
    onError: (error) => toast.error(getErrorMessage(error, 'Upload failed')),
  });

  const handleFilesChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    for (const file of files) {
      await uploadMutation.mutateAsync(file);
    }
    event.target.value = '';
  };

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <Label>{label}</Label>
          {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
        </div>
        <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()} disabled={uploadMutation.isPending}>
          <Upload className="mr-2 h-4 w-4" />
          Add images
        </Button>
      </div>

      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFilesChange} />

      {items.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item.id} className="overflow-hidden rounded-lg border">
              <div className="relative aspect-video">
                <Image
                  src={resolveMediaUrl(item.url)!}
                  alt={item.alt ?? 'Gallery image'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
              </div>
              <div className="flex items-center justify-between gap-2 p-3">
                <p className="truncate text-xs text-muted-foreground">{item.filename}</p>
                <Button type="button" variant="ghost" size="sm" onClick={() => onRemove(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          No gallery images yet.
        </div>
      )}
    </div>
  );
}
