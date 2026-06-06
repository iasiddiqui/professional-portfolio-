import type { SiteSettingsRecord } from '../../repositories/site-settings.repository.js';

export interface SettingsDto {
  id: string;
  siteName: string;
  siteDescription: string | null;
  logoUrl: string | null;
  faviconUrl: string | null;
  contactEmail: string | null;
  socialLinks: Record<string, string> | null;
  seoDefaults: Record<string, unknown> | null;
  maintenanceMode: boolean;
  updatedAt: string;
}

export function mapSettingsToDto(settings: SiteSettingsRecord): SettingsDto {
  return {
    id: settings.id,
    siteName: settings.siteName,
    siteDescription: settings.siteDescription,
    logoUrl: settings.logoUrl,
    faviconUrl: settings.faviconUrl,
    contactEmail: settings.contactEmail,
    socialLinks: (settings.socialLinks as Record<string, string> | null) ?? null,
    seoDefaults: (settings.seoDefaults as Record<string, unknown> | null) ?? null,
    maintenanceMode: settings.maintenanceMode,
    updatedAt: settings.updatedAt.toISOString(),
  };
}
