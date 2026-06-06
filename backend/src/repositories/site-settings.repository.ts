import type { Prisma } from '@prisma/client';

import { prisma } from '../lib/prisma.js';

export type SiteSettingsRecord = Prisma.SiteSettingsGetPayload<object>;

const DEFAULT_ID = 'default';

export class SiteSettingsRepository {
  async get(): Promise<SiteSettingsRecord | null> {
    return prisma.siteSettings.findUnique({ where: { id: DEFAULT_ID } });
  }

  async upsert(data: Prisma.SiteSettingsUpdateInput): Promise<SiteSettingsRecord> {
    return prisma.siteSettings.upsert({
      where: { id: DEFAULT_ID },
      create: {
        id: DEFAULT_ID,
        siteName: (data.siteName as string | undefined) ?? 'Portfolio',
        siteDescription: data.siteDescription as string | null | undefined,
        logoUrl: data.logoUrl as string | null | undefined,
        faviconUrl: data.faviconUrl as string | null | undefined,
        contactEmail: data.contactEmail as string | null | undefined,
        socialLinks: data.socialLinks as Prisma.InputJsonValue | undefined,
        seoDefaults: data.seoDefaults as Prisma.InputJsonValue | undefined,
        maintenanceMode: (data.maintenanceMode as boolean | undefined) ?? false,
      },
      update: data,
    });
  }
}

export const siteSettingsRepository = new SiteSettingsRepository();
