import 'dotenv/config';

import { RoleName } from '@prisma/client';

import { ROLE_LABELS, ROLE_PERMISSIONS } from '../src/constants/permissions.js';
import { prisma } from '../src/lib/prisma.js';
import { hashPassword } from '../src/utils/password.js';

async function seedRoles(): Promise<void> {
  for (const name of Object.values(RoleName)) {
    await prisma.role.upsert({
      where: { name },
      create: {
        name,
        label: ROLE_LABELS[name],
        description: `${ROLE_LABELS[name]} role`,
        permissions: ROLE_PERMISSIONS[name],
      },
      update: {
        label: ROLE_LABELS[name],
        permissions: ROLE_PERMISSIONS[name],
      },
    });
  }

  console.log('Roles seeded: ADMIN, EDITOR, USER');
}

async function seedAdminUser(): Promise<void> {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.log('Skipping admin user seed (ADMIN_EMAIL / ADMIN_PASSWORD not set)');
    return;
  }

  const adminRole = await prisma.role.findUnique({ where: { name: RoleName.ADMIN } });

  if (!adminRole) {
    throw new Error('Admin role not found');
  }

  const hashedPassword = await hashPassword(password);

  await prisma.user.upsert({
    where: { email: email.toLowerCase() },
    create: {
      name: 'Administrator',
      email: email.toLowerCase(),
      password: hashedPassword,
      roleId: adminRole.id,
      isActive: true,
    },
    update: {
      password: hashedPassword,
      roleId: adminRole.id,
      isActive: true,
    },
  });

  console.log(`Admin user seeded: ${email}`);
}

async function seedSiteSettings(): Promise<void> {
  await prisma.siteSettings.upsert({
    where: { id: 'default' },
    create: {
      id: 'default',
      siteName: 'Portfolio Platform',
      siteDescription: 'Professional portfolio and SaaS platform',
      maintenanceMode: false,
    },
    update: {},
  });

  console.log('Site settings seeded');
}

async function main(): Promise<void> {
  await seedRoles();
  await seedAdminUser();
  await seedSiteSettings();
}

main()
  .catch((error: unknown) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
