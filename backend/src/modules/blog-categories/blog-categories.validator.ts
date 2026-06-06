import { z } from 'zod';

const slugSchema = z
  .string()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens');

export const createBlogCategorySchema = z.object({
  name: z.string().trim().min(1).max(100),
  slug: slugSchema.optional(),
  description: z.string().trim().max(500).nullable().optional(),
});

export const updateBlogCategorySchema = createBlogCategorySchema.partial();

export const blogCategoryIdParamSchema = z.object({
  id: z.string().cuid(),
});

export type CreateBlogCategoryInput = z.infer<typeof createBlogCategorySchema>;
export type UpdateBlogCategoryInput = z.infer<typeof updateBlogCategorySchema>;
