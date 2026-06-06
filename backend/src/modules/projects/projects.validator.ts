import { ProjectStatus } from '@prisma/client';
import { z } from 'zod';

import { paginationQuerySchema } from '../../validators/pagination.validator.js';

const slugSchema = z
  .string()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens');

const optionalUrlSchema = z
  .union([z.string().url(), z.literal(''), z.null()])
  .optional()
  .transform((value) => (value === '' ? null : value ?? null));

const projectFieldsSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200),
  slug: slugSchema.optional(),
  shortDescription: z.string().trim().min(1, 'Short description is required').max(500),
  description: z.string().trim().min(1, 'Description is required'),
  techStack: z.array(z.string().trim().min(1)).min(1, 'At least one technology is required'),
  architecture: z.string().trim().min(1, 'Architecture is required'),
  githubUrl: optionalUrlSchema,
  liveUrl: optionalUrlSchema,
  featured: z.boolean().default(false),
  status: z.nativeEnum(ProjectStatus).default(ProjectStatus.DRAFT),
  categoryId: z.string().cuid().nullable().optional(),
  thumbnailMediaId: z.string().cuid().nullable().optional(),
  galleryMediaIds: z.array(z.string().cuid()).optional().default([]),
});

export const createProjectSchema = projectFieldsSchema;

export const updateProjectSchema = projectFieldsSchema.partial().extend({
  removeMediaIds: z.array(z.string().cuid()).optional().default([]),
});

export const updateProjectStatusSchema = z.object({
  status: z.nativeEnum(ProjectStatus),
});

export const projectListQuerySchema = paginationQuerySchema.extend({
  status: z.nativeEnum(ProjectStatus).optional(),
  featured: z
    .union([z.literal('true'), z.literal('false')])
    .optional()
    .transform((value) => (value === undefined ? undefined : value === 'true')),
  search: z.string().trim().optional(),
});

export const projectIdParamSchema = z.object({
  id: z.string().cuid(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type UpdateProjectStatusInput = z.infer<typeof updateProjectStatusSchema>;
export type ProjectListQueryInput = z.infer<typeof projectListQuerySchema>;

export const projectSchemas = {
  create: createProjectSchema,
  update: updateProjectSchema,
  updateStatus: updateProjectStatusSchema,
  listQuery: projectListQuerySchema,
  idParam: projectIdParamSchema,
};
