'use client';

import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form';

import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FormCheckboxFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  description?: string;
  className?: string;
}

export function FormCheckboxField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  className,
}: FormCheckboxFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className={cn('flex items-start gap-3 rounded-lg border p-4', className)}>
          <input
            id={name}
            type="checkbox"
            checked={Boolean(field.value)}
            onChange={(event) => field.onChange(event.target.checked)}
            className="mt-1 h-4 w-4 rounded border-input accent-accent"
          />
          <div className="space-y-1">
            <Label htmlFor={name} className="cursor-pointer">
              {label}
            </Label>
            {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
          </div>
        </div>
      )}
    />
  );
}
