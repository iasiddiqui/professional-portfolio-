import type { LeadSource, LeadStatus, Prisma } from '@prisma/client';

import { prisma } from '../lib/prisma.js';

export type LeadWithNotes = Prisma.LeadGetPayload<{
  include: {
    notes: {
      include: { author: { select: { id: true; name: true; email: true } } };
      orderBy: { createdAt: 'desc' };
    };
  };
}>;

export interface LeadListFilters {
  page: number;
  limit: number;
  skip: number;
  status?: LeadStatus;
  source?: LeadSource;
  search?: string;
  projectType?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export type LeadSummary = Prisma.LeadGetPayload<Record<string, never>>;

export class LeadRepository {
  private readonly include = {
    notes: {
      include: { author: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' as const },
    },
  };

  async findMany(filters: LeadListFilters): Promise<{ items: LeadWithNotes[]; total: number }> {
    const where: Prisma.LeadWhereInput = {};

    if (filters.status) where.status = filters.status;
    if (filters.source) where.source = filters.source;
    if (filters.projectType) where.projectType = filters.projectType;

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
        { company: { contains: filters.search, mode: 'insensitive' } },
        { message: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.dateFrom || filters.dateTo) {
      where.createdAt = {
        ...(filters.dateFrom ? { gte: filters.dateFrom } : {}),
        ...(filters.dateTo ? { lte: filters.dateTo } : {}),
      };
    }

    const [items, total] = await prisma.$transaction([
      prisma.lead.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: filters.skip,
        take: filters.limit,
      }),
      prisma.lead.count({ where }),
    ]);

    return { items: items as LeadWithNotes[], total };
  }

  async findById(id: string): Promise<LeadWithNotes | null> {
    return prisma.lead.findUnique({ where: { id }, include: this.include });
  }

  async create(data: Prisma.LeadCreateInput): Promise<LeadWithNotes> {
    return prisma.lead.create({ data, include: this.include });
  }

  async update(id: string, data: Prisma.LeadUpdateInput): Promise<LeadWithNotes> {
    return prisma.lead.update({ where: { id }, data, include: this.include });
  }

  async updateEmailFlags(
    id: string,
    flags: { adminEmailSent: boolean; confirmationEmailSent: boolean }
  ): Promise<void> {
    await prisma.lead.update({
      where: { id },
      data: flags,
    });
  }

  async findPipeline(limitPerStatus = 20): Promise<Record<LeadStatus, LeadSummary[]>> {
    const statuses: LeadStatus[] = ['NEW', 'CONTACTED', 'IN_PROGRESS', 'CLOSED'];
    const grouped = await Promise.all(
      statuses.map((status) =>
        prisma.lead.findMany({
          where: { status },
          orderBy: { createdAt: 'desc' },
          take: limitPerStatus,
        })
      )
    );

    return {
      NEW: grouped[0] ?? [],
      CONTACTED: grouped[1] ?? [],
      IN_PROGRESS: grouped[2] ?? [],
      CLOSED: grouped[3] ?? [],
    };
  }

  async delete(id: string): Promise<LeadWithNotes> {
    return prisma.lead.delete({ where: { id }, include: this.include });
  }

  async getStats() {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [total, newLeads, closedLeads, monthlyLeads] = await prisma.$transaction([
      prisma.lead.count(),
      prisma.lead.count({ where: { status: 'NEW' } }),
      prisma.lead.count({ where: { status: 'CLOSED' } }),
      prisma.lead.count({ where: { createdAt: { gte: monthStart } } }),
    ]);

    const conversionRate = total > 0 ? Math.round((closedLeads / total) * 1000) / 10 : 0;

    return { total, newLeads, closedLeads, monthlyLeads, conversionRate };
  }
}

export const leadRepository = new LeadRepository();
