import { LeadSource, LeadStatus } from '@prisma/client';
import { z } from 'zod';

import { paginationQuerySchema } from '../../validators/pagination.validator.js';

const leadFieldsSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email(),
  company: z.string().trim().max(120).nullable().optional(),
  budget: z.string().trim().max(100).nullable().optional(),
  projectType: z.string().trim().max(100).nullable().optional(),
  timeline: z.string().trim().max(200).nullable().optional(),
  preferredTime: z.string().trim().max(200).nullable().optional(),
  message: z.string().trim().min(1),
  source: z.nativeEnum(LeadSource).default(LeadSource.CONTACT),
  status: z.nativeEnum(LeadStatus).default(LeadStatus.NEW),
});

export const createLeadSchema = leadFieldsSchema;

export const updateLeadSchema = leadFieldsSchema.partial();

export const updateLeadStatusSchema = z.object({
  status: z.nativeEnum(LeadStatus),
});

export const createLeadNoteSchema = z.object({
  content: z.string().trim().min(1).max(5000),
});

export const leadListQuerySchema = paginationQuerySchema.extend({
  status: z.nativeEnum(LeadStatus).optional(),
  source: z.nativeEnum(LeadSource).optional(),
  search: z.string().trim().optional(),
  projectType: z.string().trim().optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
});

export const leadPipelineQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export const leadIdParamSchema = z.object({
  id: z.string().cuid(),
});

export const leadNoteIdParamSchema = z.object({
  id: z.string().cuid(),
  noteId: z.string().cuid(),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
export type UpdateLeadStatusInput = z.infer<typeof updateLeadStatusSchema>;
export type CreateLeadNoteInput = z.infer<typeof createLeadNoteSchema>;
export type LeadListQueryInput = z.infer<typeof leadListQuerySchema>;
export type LeadPipelineQueryInput = z.infer<typeof leadPipelineQuerySchema>;
