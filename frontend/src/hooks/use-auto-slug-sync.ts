'use client';

import { useEffect, useRef } from 'react';
import type { FieldPath, FieldValues, PathValue, UseFormReturn } from 'react-hook-form';

import { slugify } from '@/utils/string';

interface UseAutoSlugSyncOptions<T extends FieldValues> {
  title: string;
  slugField?: FieldPath<T>;
  /** When false, slug is not auto-generated (e.g. editing an existing record). */
  enabled?: boolean;
}

export function useAutoSlugSync<T extends FieldValues>(
  form: UseFormReturn<T>,
  { title, slugField = 'slug' as FieldPath<T>, enabled = true }: UseAutoSlugSyncOptions<T>
) {
  const autoSync = useRef(enabled);

  useEffect(() => {
    autoSync.current = enabled;
  }, [enabled]);

  const { setValue } = form;

  useEffect(() => {
    if (!autoSync.current || !title.trim()) {
      return;
    }

    setValue(slugField, slugify(title) as PathValue<T, typeof slugField>, {
      shouldDirty: true,
    });
  }, [title, slugField, setValue]);

  const markSlugManual = () => {
    autoSync.current = false;
  };

  return { markSlugManual };
}
