import { z } from 'zod';

import { paginationQuerySchema } from '../../validators/pagination.validator.js';

const resumeFileUrlSchema = z
  .string()
  .trim()
  .min(1, 'Resume file is required')
  .refine(
    (value) => {
      if (value.startsWith('/uploads/')) return true;

      try {
        const parsed = new URL(value);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
      } catch {
        return false;
      }
    },
    'Must be a valid URL or uploaded file path'
  );

const resumeFieldsSchema = z.object({
  title: z.string().trim().min(1).max(200),
  fileUrl: resumeFileUrlSchema,
  version: z.string().trim().min(1).max(50),
  isActive: z.boolean().default(false),
});

export const createResumeSchema = resumeFieldsSchema;

export const updateResumeSchema = resumeFieldsSchema.partial();

export const resumeListQuerySchema = paginationQuerySchema.extend({
  search: z.string().trim().optional(),
  isActive: z
    .union([z.literal('true'), z.literal('false')])
    .optional()
    .transform((value) => (value === undefined ? undefined : value === 'true')),
});

export const resumeIdParamSchema = z.object({
  id: z.string().cuid(),
});

export type CreateResumeInput = z.infer<typeof createResumeSchema>;
export type UpdateResumeInput = z.infer<typeof updateResumeSchema>;
export type ResumeListQueryInput = z.infer<typeof resumeListQuerySchema>;
