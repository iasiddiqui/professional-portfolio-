import { Prisma } from '@prisma/client';

import { PERMISSIONS, hasPermission } from '../../constants/permissions.js';
import { HTTP_STATUS } from '../../constants/http-status.js';
import { siteSettingsRepository } from '../../repositories/site-settings.repository.js';
import { AppError } from '../../utils/app-error.js';
import { mapSettingsToDto } from './settings.dto.js';
import type { UpdateSettingsInput } from './settings.validator.js';

export class SettingsService {
  async get() {
    const settings = await siteSettingsRepository.get();
    return settings ? mapSettingsToDto(settings) : null;
  }

  async update(input: UpdateSettingsInput, permissions: string[]) {
    this.assertWritePermission(permissions);

    if (Object.keys(input).length === 0) {
      throw new AppError('No settings fields provided', HTTP_STATUS.BAD_REQUEST);
    }

    const settings = await siteSettingsRepository.upsert({
      ...(input.siteName !== undefined ? { siteName: input.siteName } : {}),
      ...(input.siteDescription !== undefined ? { siteDescription: input.siteDescription } : {}),
      ...(input.logoUrl !== undefined ? { logoUrl: input.logoUrl } : {}),
      ...(input.faviconUrl !== undefined ? { faviconUrl: input.faviconUrl } : {}),
      ...(input.contactEmail !== undefined ? { contactEmail: input.contactEmail } : {}),
      ...(input.socialLinks !== undefined
        ? {
            socialLinks:
              input.socialLinks === null
                ? Prisma.JsonNull
                : (input.socialLinks as Prisma.InputJsonValue),
          }
        : {}),
      ...(input.seoDefaults !== undefined
        ? {
            seoDefaults:
              input.seoDefaults === null
                ? Prisma.JsonNull
                : (input.seoDefaults as Prisma.InputJsonValue),
          }
        : {}),
      ...(input.maintenanceMode !== undefined ? { maintenanceMode: input.maintenanceMode } : {}),
    });

    return mapSettingsToDto(settings);
  }

  private assertWritePermission(permissions: string[]) {
    if (!hasPermission(permissions, [PERMISSIONS.SETTINGS_WRITE])) {
      throw new AppError('Insufficient permissions', HTTP_STATUS.FORBIDDEN);
    }
  }
}

export const settingsService = new SettingsService();
