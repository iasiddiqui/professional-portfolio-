import { z } from 'zod';

import { paginationQuerySchema } from '../../validators/pagination.validator.js';

const testimonialFieldsSchema = z.object({
  clientName: z.string().trim().min(1).max(120),
  company: z.string().trim().max(120).nullable().optional(),
  designation: z.string().trim().max(120).nullable().optional(),
  content: z.string().trim().min(1),
  rating: z.number().int().min(1).max(5).nullable().optional(),
  featured: z.boolean().default(false),
});

export const createTestimonialSchema = testimonialFieldsSchema;

export const updateTestimonialSchema = testimonialFieldsSchema.partial();

export const testimonialListQuerySchema = paginationQuerySchema.extend({
  search: z.string().trim().optional(),
  featured: z
    .union([z.literal('true'), z.literal('false')])
    .optional()
    .transform((value) => (value === undefined ? undefined : value === 'true')),
});

export const testimonialIdParamSchema = z.object({
  id: z.string().cuid(),
});

export type CreateTestimonialInput = z.infer<typeof createTestimonialSchema>;
export type UpdateTestimonialInput = z.infer<typeof updateTestimonialSchema>;
export type TestimonialListQueryInput = z.infer<typeof testimonialListQuerySchema>;
