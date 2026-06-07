'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  description?: string;
  type?: string;
  as?: 'input' | 'textarea';
  className?: string;
  onValueChange?: (value: string) => void;
}

export function FormField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  description,
  type = 'text',
  as = 'input',
  className,
  onValueChange,
}: FormFieldProps<T>) {
  const fieldId = String(name);
  const errorId = `${fieldId}-error`;
  const descriptionId = description ? `${fieldId}-description` : undefined;
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === 'password';

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    onChange: (value: string) => void
  ) => {
    onChange(event.target.value);
    onValueChange?.(event.target.value);
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className={cn('space-y-2', className)}>
          <Label htmlFor={fieldId}>{label}</Label>
          {description ? (
            <p id={descriptionId} className="text-sm text-muted-foreground">
              {description}
            </p>
          ) : null}
          {as === 'textarea' ? (
            <Textarea
              id={fieldId}
              placeholder={placeholder}
              aria-invalid={fieldState.invalid || undefined}
              aria-describedby={
                [fieldState.error ? errorId : null, descriptionId].filter(Boolean).join(' ') || undefined
              }
              name={field.name}
              value={field.value ?? ''}
              onBlur={field.onBlur}
              ref={field.ref}
              onChange={(event) => handleChange(event, field.onChange)}
            />
          ) : isPasswordField ? (
            <div className="relative">
              <Input
                id={fieldId}
                type={showPassword ? 'text' : 'password'}
                placeholder={placeholder}
                className="pr-10"
                aria-invalid={fieldState.invalid || undefined}
                aria-describedby={
                  [fieldState.error ? errorId : null, descriptionId].filter(Boolean).join(' ') || undefined
                }
                name={field.name}
                value={field.value ?? ''}
                onBlur={field.onBlur}
                ref={field.ref}
                onChange={(event) => handleChange(event, field.onChange)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-10 w-10 text-muted-foreground hover:text-foreground"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          ) : (
            <Input
              id={fieldId}
              type={type}
              placeholder={placeholder}
              aria-invalid={fieldState.invalid || undefined}
              aria-describedby={
                [fieldState.error ? errorId : null, descriptionId].filter(Boolean).join(' ') || undefined
              }
              name={field.name}
              value={field.value ?? ''}
              onBlur={field.onBlur}
              ref={field.ref}
              onChange={(event) => handleChange(event, field.onChange)}
            />
          )}
          {fieldState.error ? (
            <p id={errorId} className="text-sm text-destructive" role="alert">
              {fieldState.error.message}
            </p>
          ) : null}
        </div>
      )}
    />
  );
}
