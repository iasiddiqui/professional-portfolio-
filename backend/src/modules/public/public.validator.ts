import { z } from 'zod';

import { paginationQuerySchema } from '../../validators/pagination.validator.js';

export const publicListQuerySchema = paginationQuerySchema.extend({
  search: z.string().trim().optional(),
  featured: z
    .enum(['true', 'false'])
    .optional()
    .transform((value) => (value === undefined ? undefined : value === 'true')),
});

export const publicSlugParamSchema = z.object({
  slug: z.string().trim().min(1),
});

export const publicContactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email(),
  company: z.string().trim().max(120).optional(),
  budget: z.string().trim().max(100).optional(),
  projectType: z.string().trim().max(100).optional(),
  message: z.string().trim().min(10).max(5000),
});

export const publicHireMeSchema = publicContactSchema.extend({
  timeline: z.string().trim().max(200).optional(),
});

export const publicConsultationSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email(),
  company: z.string().trim().max(120).optional(),
  projectType: z.string().trim().max(100).optional(),
  preferredTime: z.string().trim().max(200).optional(),
  message: z.string().trim().min(10).max(5000),
});

export type PublicListQueryInput = z.infer<typeof publicListQuerySchema>;
export type PublicContactInput = z.infer<typeof publicContactSchema>;
export type PublicHireMeInput = z.infer<typeof publicHireMeSchema>;
export type PublicConsultationInput = z.infer<typeof publicConsultationSchema>;
