import type { LeadWithNotes } from '../../repositories/lead.repository.js';
import type { LeadNoteWithAuthor } from '../../repositories/lead-note.repository.js';

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
  message: string;
  status: string;
  notes: LeadNoteDto[];
  createdAt: string;
  updatedAt: string;
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
    message: lead.message,
    status: lead.status,
    notes: (lead.notes ?? []).map(mapNote),
    createdAt: lead.createdAt.toISOString(),
    updatedAt: lead.updatedAt.toISOString(),
  };
}
