import { z } from 'zod';

import { paginationQuerySchema } from '../../validators/pagination.validator.js';

const resumeFieldsSchema = z.object({
  title: z.string().trim().min(1).max(200),
  fileUrl: z.string().trim().url(),
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
