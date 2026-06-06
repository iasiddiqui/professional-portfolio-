import type { Prisma, Role, User } from '@prisma/client';

import { prisma } from '../lib/prisma.js';

export type UserWithRole = User & { role: Role };

export function parsePermissions(permissions: Prisma.JsonValue): string[] {
  if (Array.isArray(permissions)) {
    return permissions.filter((item): item is string => typeof item === 'string');
  }

  return [];
}

export function mapUserWithPermissions(user: UserWithRole) {
  return {
    ...user,
    permissions: parsePermissions(user.role.permissions),
  };
}

export class UserRepository {
  async findByEmail(email: string): Promise<UserWithRole | null> {
    return prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { role: true },
    });
  }

  async findById(id: string): Promise<UserWithRole | null> {
    return prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });
  }

  async findActiveById(id: string): Promise<UserWithRole | null> {
    return prisma.user.findFirst({
      where: { id, isActive: true },
      include: { role: true },
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<UserWithRole> {
    return prisma.user.create({
      data,
      include: { role: true },
    });
  }

  async updatePassword(userId: string, password: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { password },
    });
  }

  async emailExists(email: string): Promise<boolean> {
    const count = await prisma.user.count({
      where: { email: email.toLowerCase() },
    });

    return count > 0;
  }
}

export const userRepository = new UserRepository();
