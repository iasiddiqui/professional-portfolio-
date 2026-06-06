import { z } from 'zod';

const slugSchema = z
  .string()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens');

export const createTagSchema = z.object({
  name: z.string().trim().min(1).max(100),
  slug: slugSchema.optional(),
});

export const updateTagSchema = createTagSchema.partial();

export const tagIdParamSchema = z.object({
  id: z.string().cuid(),
});

export type CreateTagInput = z.infer<typeof createTagSchema>;
export type UpdateTagInput = z.infer<typeof updateTagSchema>;
