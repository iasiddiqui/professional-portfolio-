import { PERMISSIONS, hasPermission } from '../../constants/permissions.js';
import { HTTP_STATUS } from '../../constants/http-status.js';
import { leadNoteRepository } from '../../repositories/lead-note.repository.js';
import { leadRepository } from '../../repositories/lead.repository.js';
import { AppError } from '../../utils/app-error.js';
import { mapLeadToDto } from './leads.dto.js';
import type {
  CreateLeadInput,
  CreateLeadNoteInput,
  LeadListQueryInput,
  UpdateLeadInput,
  UpdateLeadStatusInput,
} from './leads.validator.js';

export class LeadsService {
  async list(query: LeadListQueryInput) {
    const page = query.page;
    const limit = query.limit;
    const skip = (page - 1) * limit;

    const { items, total } = await leadRepository.findMany({
      page,
      limit,
      skip,
      status: query.status,
      search: query.search,
      projectType: query.projectType,
      dateFrom: query.dateFrom,
      dateTo: query.dateTo,
    });

    return { items: items.map(mapLeadToDto), total, page, limit };
  }

  async getStats() {
    return leadRepository.getStats();
  }

  async getById(id: string) {
    const lead = await leadRepository.findById(id);
    if (!lead) throw new AppError('Lead not found', HTTP_STATUS.NOT_FOUND);
    return mapLeadToDto(lead);
  }

  async create(input: CreateLeadInput, permissions: string[]) {
    this.assertWritePermission(permissions);

    const lead = await leadRepository.create({
      name: input.name,
      email: input.email,
      company: input.company ?? null,
      budget: input.budget ?? null,
      projectType: input.projectType ?? null,
      message: input.message,
      status: input.status,
    });

    return mapLeadToDto(lead);
  }

  async update(id: string, input: UpdateLeadInput, permissions: string[]) {
    this.assertWritePermission(permissions);

    const existing = await leadRepository.findById(id);
    if (!existing) throw new AppError('Lead not found', HTTP_STATUS.NOT_FOUND);

    const lead = await leadRepository.update(id, {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.email !== undefined ? { email: input.email } : {}),
      ...(input.company !== undefined ? { company: input.company } : {}),
      ...(input.budget !== undefined ? { budget: input.budget } : {}),
      ...(input.projectType !== undefined ? { projectType: input.projectType } : {}),
      ...(input.message !== undefined ? { message: input.message } : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
    });

    return mapLeadToDto(lead);
  }

  async updateStatus(id: string, input: UpdateLeadStatusInput, permissions: string[]) {
    this.assertWritePermission(permissions);

    const existing = await leadRepository.findById(id);
    if (!existing) throw new AppError('Lead not found', HTTP_STATUS.NOT_FOUND);

    const lead = await leadRepository.update(id, { status: input.status });
    return mapLeadToDto(lead);
  }

  async delete(id: string, permissions: string[]) {
    this.assertWritePermission(permissions);

    const existing = await leadRepository.findById(id);
    if (!existing) throw new AppError('Lead not found', HTTP_STATUS.NOT_FOUND);

    await leadRepository.delete(id);
    return { id };
  }

  async addNote(leadId: string, input: CreateLeadNoteInput, authorId: string, permissions: string[]) {
    this.assertWritePermission(permissions);

    const lead = await leadRepository.findById(leadId);
    if (!lead) throw new AppError('Lead not found', HTTP_STATUS.NOT_FOUND);

    await leadNoteRepository.create({
      content: input.content,
      lead: { connect: { id: leadId } },
      author: { connect: { id: authorId } },
    });

    const refreshed = await leadRepository.findById(leadId);
    return mapLeadToDto(refreshed!);
  }

  async deleteNote(leadId: string, noteId: string, permissions: string[]) {
    this.assertWritePermission(permissions);

    const note = await leadNoteRepository.findById(noteId);
    if (!note || note.leadId !== leadId) {
      throw new AppError('Note not found', HTTP_STATUS.NOT_FOUND);
    }

    await leadNoteRepository.delete(noteId);

    const refreshed = await leadRepository.findById(leadId);
    return mapLeadToDto(refreshed!);
  }

  private assertWritePermission(permissions: string[]) {
    if (!hasPermission(permissions, [PERMISSIONS.LEADS_WRITE])) {
      throw new AppError('Insufficient permissions', HTTP_STATUS.FORBIDDEN);
    }
  }
}

export const leadsService = new LeadsService();
