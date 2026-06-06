export interface SiteSettings {
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

export interface UpdateSettingsPayload {
  siteName?: string;
  siteDescription?: string | null;
  logoUrl?: string | null;
  faviconUrl?: string | null;
  contactEmail?: string | null;
  socialLinks?: Record<string, string> | null;
  seoDefaults?: Record<string, unknown> | null;
  maintenanceMode?: boolean;
}
