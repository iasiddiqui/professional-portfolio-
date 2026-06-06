import { z } from 'zod';

export const testimonialFormSchema = z.object({
  clientName: z.string().trim().min(1, 'Client name is required').max(120),
  company: z.string().trim(),
  designation: z.string().trim(),
  content: z.string().trim().min(1, 'Content is required'),
  rating: z.string(),
  featured: z.boolean(),
});

export type TestimonialFormValues = z.infer<typeof testimonialFormSchema>;

export function toTestimonialPayload(values: TestimonialFormValues) {
  return {
    clientName: values.clientName,
    company: values.company || null,
    designation: values.designation || null,
    content: values.content,
    rating: values.rating === '__none__' ? null : Number(values.rating),
    featured: values.featured,
  };
}

export function toTestimonialFormValues(testimonial: {
  clientName: string;
  company: string | null;
  designation: string | null;
  content: string;
  rating: number | null;
  featured: boolean;
}): TestimonialFormValues {
  return {
    clientName: testimonial.clientName,
    company: testimonial.company ?? '',
    designation: testimonial.designation ?? '',
    content: testimonial.content,
    rating: testimonial.rating ? String(testimonial.rating) : '__none__',
    featured: testimonial.featured,
  };
}

export const testimonialFormDefaultValues: TestimonialFormValues = {
  clientName: '',
  company: '',
  designation: '',
  content: '',
  rating: '__none__',
  featured: false,
};
