import type { LeadWithNotes } from '../../repositories/lead.repository.js';
import type { LeadNoteWithAuthor } from '../../repositories/lead-note.repository.js';
import type { LeadSummary } from '../../repositories/lead.repository.js';
import type { LeadStatus } from '@prisma/client';

export interface LeadNoteDto {
  id: string;
  content: string;
  authorId: string | null;
  author: { id: string; name: string; email: string } | null;
  createdAt: string;
  updatedAt: string;
}

export interface LeadDto {
  id: string;
  name: string;
  email: string;
  company: string | null;
  budget: string | null;
  projectType: string | null;
  timeline: string | null;
  preferredTime: string | null;
  message: string;
  source: string;
  status: string;
  adminEmailSent: boolean;
  confirmationEmailSent: boolean;
  notes: LeadNoteDto[];
  createdAt: string;
  updatedAt: string;
}

export interface LeadPipelineItemDto {
  id: string;
  name: string;
  email: string;
  company: string | null;
  projectType: string | null;
  source: string;
  status: string;
  createdAt: string;
}

export interface LeadPipelineDto {
  NEW: LeadPipelineItemDto[];
  CONTACTED: LeadPipelineItemDto[];
  IN_PROGRESS: LeadPipelineItemDto[];
  CLOSED: LeadPipelineItemDto[];
}

export interface LeadStatsDto {
  total: number;
  newLeads: number;
  closedLeads: number;
  monthlyLeads: number;
  conversionRate: number;
}

function mapNote(note: LeadNoteWithAuthor): LeadNoteDto {
  return {
    id: note.id,
    content: note.content,
    authorId: note.authorId,
    author: note.author,
    createdAt: note.createdAt.toISOString(),
    updatedAt: note.updatedAt.toISOString(),
  };
}

export function mapLeadToDto(lead: LeadWithNotes): LeadDto {
  return {
    id: lead.id,
    name: lead.name,
    email: lead.email,
    company: lead.company,
    budget: lead.budget,
    projectType: lead.projectType,
    timeline: lead.timeline,
    preferredTime: lead.preferredTime,
    message: lead.message,
    source: lead.source,
    status: lead.status,
    adminEmailSent: lead.adminEmailSent,
    confirmationEmailSent: lead.confirmationEmailSent,
    notes: (lead.notes ?? []).map(mapNote),
    createdAt: lead.createdAt.toISOString(),
    updatedAt: lead.updatedAt.toISOString(),
  };
}

export function mapLeadToPipelineItem(lead: LeadSummary): LeadPipelineItemDto {
  return {
    id: lead.id,
    name: lead.name,
    email: lead.email,
    company: lead.company,
    projectType: lead.projectType,
    source: lead.source,
    status: lead.status,
    createdAt: lead.createdAt.toISOString(),
  };
}

export function mapPipelineToDto(
  pipeline: Record<LeadStatus, LeadSummary[]>
): LeadPipelineDto {
  return {
    NEW: pipeline.NEW.map(mapLeadToPipelineItem),
    CONTACTED: pipeline.CONTACTED.map(mapLeadToPipelineItem),
    IN_PROGRESS: pipeline.IN_PROGRESS.map(mapLeadToPipelineItem),
    CLOSED: pipeline.CLOSED.map(mapLeadToPipelineItem),
  };
}
