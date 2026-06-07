import { z } from 'zod';

import { paginationQuerySchema } from '../../validators/pagination.validator.js';

const knowledgeBaseFieldsSchema = z.object({
  title: z.string().trim().min(1).max(200),
  content: z.string().trim().min(1),
  category: z.string().trim().min(1).max(100),
  active: z.boolean().default(true),
});

export const createKnowledgeBaseSchema = knowledgeBaseFieldsSchema;

export const updateKnowledgeBaseSchema = knowledgeBaseFieldsSchema.partial();

export const knowledgeBaseListQuerySchema = paginationQuerySchema.extend({
  search: z.string().trim().optional(),
  category: z.string().trim().optional(),
  active: z
    .union([z.literal('true'), z.literal('false')])
    .optional()
    .transform((value) => (value === undefined ? undefined : value === 'true')),
});

export const knowledgeBaseIdParamSchema = z.object({
  id: z.string().trim().min(1),
});

export type CreateKnowledgeBaseInput = z.infer<typeof createKnowledgeBaseSchema>;
export type UpdateKnowledgeBaseInput = z.infer<typeof updateKnowledgeBaseSchema>;
export type KnowledgeBaseListQueryInput = z.infer<typeof knowledgeBaseListQuerySchema>;
