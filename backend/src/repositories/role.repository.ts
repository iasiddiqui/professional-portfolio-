import type { Role } from '@prisma/client';

import { prisma } from '../lib/prisma.js';

export class RoleRepository {
  async findByName(name: Role['name']) {
    return prisma.role.findUnique({ where: { name } });
  }

  async findById(id: string) {
    return prisma.role.findUnique({ where: { id } });
  }

  async findAll() {
    return prisma.role.findMany({ orderBy: { name: 'asc' } });
  }
}

export const roleRepository = new RoleRepository();
