'use client';

import { FormCheckboxField } from '@/components/forms/form-checkbox-field';
import { FormField } from '@/components/forms/form-field';
import { FormSelectField } from '@/components/forms/form-select-field';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RATING_OPTIONS } from '@/features/testimonials/config/testimonial.config';
import {
  useCreateTestimonial,
  useUpdateTestimonial,
} from '@/features/testimonials/hooks/use-testimonial-mutations';
import {
  testimonialFormDefaultValues,
  testimonialFormSchema,
  toTestimonialFormValues,
  toTestimonialPayload,
  type TestimonialFormValues,
} from '@/features/testimonials/schemas/testimonial.schemas';
import type { Testimonial } from '@/features/testimonials/types/testimonial.types';
import { useZodForm } from '@/hooks/use-zod-form';
import { useEffect } from 'react';

interface TestimonialFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  testimonial?: Testimonial | null;
}

export function TestimonialFormDialog({ open, onOpenChange, testimonial }: TestimonialFormDialogProps) {
  const createMutation = useCreateTestimonial();
  const updateMutation = useUpdateTestimonial();
  const form = useZodForm(testimonialFormSchema, testimonialFormDefaultValues);
  const isEditing = Boolean(testimonial);

  useEffect(() => {
    if (open) {
      form.reset(testimonial ? toTestimonialFormValues(testimonial) : testimonialFormDefaultValues);
    }
  }, [form, open, testimonial]);

  const handleSubmit = form.handleSubmit(async (values: TestimonialFormValues) => {
    const payload = toTestimonialPayload(values);

    if (isEditing && testimonial) {
      await updateMutation.mutateAsync({ id: testimonial.id, payload });
    } else {
      await createMutation.mutateAsync(payload);
    }

    onOpenChange(false);
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit testimonial' : 'New testimonial'}</DialogTitle>
          <DialogDescription>Add client feedback to display on the public site.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField control={form.control} name="clientName" label="Client name" />
          <FormField control={form.control} name="company" label="Company" />
          <FormField control={form.control} name="designation" label="Designation" />
          <FormField control={form.control} name="content" label="Testimonial" as="textarea" />
          <FormSelectField
            control={form.control}
            name="rating"
            label="Rating"
            options={RATING_OPTIONS.map((option) => ({ value: option.value, label: option.label }))}
          />
          <FormCheckboxField
            control={form.control}
            name="featured"
            label="Featured testimonial"
            description="Featured testimonials may be highlighted on the homepage."
          />
          <Button type="submit" variant="accent" disabled={isPending}>
            {isPending ? 'Saving...' : isEditing ? 'Save changes' : 'Create testimonial'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
