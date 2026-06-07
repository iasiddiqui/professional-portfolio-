import { ContentFormat } from '@prisma/client';
import { z } from 'zod';

import { paginationQuerySchema } from '../../validators/pagination.validator.js';
import { optionalMediaUrlSchema } from '../../validators/media-url.validator.js';

const slugSchema = z
  .string()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens');

const optionalNullableTextSchema = (max: number) =>
  z
    .union([z.string().trim().max(max), z.literal(''), z.null()])
    .optional()
    .transform((value) => (value === '' || value === undefined ? null : (value ?? null)));

const blogFieldsSchema = z.object({
  title: z.string().trim().min(1).max(200),
  slug: z
    .union([slugSchema, z.literal('')])
    .optional()
    .transform((value) => (value === '' ? undefined : value)),
  excerpt: z.string().trim().min(1).max(500),
  content: z.string().trim().min(1, 'Content is required'),
  contentFormat: z.nativeEnum(ContentFormat).default(ContentFormat.MDX),
  featuredImage: optionalMediaUrlSchema,
  published: z.boolean().default(false),
  seoTitle: optionalNullableTextSchema(70),
  seoDescription: optionalNullableTextSchema(160),
  categoryId: z
    .union([z.string().cuid(), z.literal('__none__'), z.literal(''), z.null()])
    .optional()
    .transform((value) => {
      if (value === '__none__' || value === '' || value === undefined) return null;
      return value;
    }),
  tagIds: z.array(z.string().cuid()).optional().default([]),
});

export const createBlogPostSchema = blogFieldsSchema;

export const updateBlogPostSchema = blogFieldsSchema.partial();

export const publishBlogPostSchema = z.object({
  published: z.boolean(),
});

export const blogListQuerySchema = paginationQuerySchema.extend({
  published: z
    .union([z.literal('true'), z.literal('false')])
    .optional()
    .transform((value) => (value === undefined ? undefined : value === 'true')),
  categoryId: z.string().cuid().optional(),
  tagId: z.string().cuid().optional(),
  search: z.string().trim().optional(),
});

export const blogIdParamSchema = z.object({
  id: z.string().cuid(),
});

export type CreateBlogPostInput = z.infer<typeof createBlogPostSchema>;
export type UpdateBlogPostInput = z.infer<typeof updateBlogPostSchema>;
export type PublishBlogPostInput = z.infer<typeof publishBlogPostSchema>;
export type BlogListQueryInput = z.infer<typeof blogListQuerySchema>;
