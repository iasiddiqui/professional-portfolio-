import type { Prisma } from '@prisma/client';

import { prisma } from '../lib/prisma.js';

export type LeadNoteWithAuthor = Prisma.LeadNoteGetPayload<{
  include: { author: { select: { id: true; name: true; email: true } } };
}>;

export class LeadNoteRepository {
  async create(data: Prisma.LeadNoteCreateInput): Promise<LeadNoteWithAuthor> {
    return prisma.leadNote.create({
      data,
      include: { author: { select: { id: true, name: true, email: true } } },
    });
  }

  async findById(id: string): Promise<LeadNoteWithAuthor | null> {
    return prisma.leadNote.findUnique({
      where: { id },
      include: { author: { select: { id: true, name: true, email: true } } },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.leadNote.delete({ where: { id } });
  }
}

export const leadNoteRepository = new LeadNoteRepository();
