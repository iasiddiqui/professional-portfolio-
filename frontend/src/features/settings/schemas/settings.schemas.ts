import { z } from 'zod';

const optionalUrlField = z
  .string()
  .trim()
  .refine((value) => !value || z.string().url().safeParse(value).success, 'Must be a valid URL');

const optionalEmailField = z
  .string()
  .trim()
  .refine((value) => !value || z.string().email().safeParse(value).success, 'Must be a valid email');

export const settingsFormSchema = z.object({
  siteName: z.string().trim().min(1, 'Site name is required').max(200),
  siteDescription: z.string().trim().max(500),
  logoUrl: optionalUrlField,
  faviconUrl: optionalUrlField,
  contactEmail: optionalEmailField,
  linkedinUrl: optionalUrlField,
  githubUrl: optionalUrlField,
  twitterUrl: optionalUrlField,
  seoTitle: z.string().trim().max(70),
  seoDescription: z.string().trim().max(160),
  maintenanceMode: z.boolean(),
});

export type SettingsFormValues = z.infer<typeof settingsFormSchema>;

export function toSettingsPayload(values: SettingsFormValues) {
  const socialLinks: Record<string, string> = {};

  if (values.linkedinUrl) socialLinks.linkedin = values.linkedinUrl;
  if (values.githubUrl) socialLinks.github = values.githubUrl;
  if (values.twitterUrl) socialLinks.twitter = values.twitterUrl;

  const seoDefaults: Record<string, string> = {};
  if (values.seoTitle) seoDefaults.title = values.seoTitle;
  if (values.seoDescription) seoDefaults.description = values.seoDescription;

  return {
    siteName: values.siteName,
    siteDescription: values.siteDescription || null,
    logoUrl: values.logoUrl || null,
    faviconUrl: values.faviconUrl || null,
    contactEmail: values.contactEmail || null,
    socialLinks: Object.keys(socialLinks).length > 0 ? socialLinks : null,
    seoDefaults: Object.keys(seoDefaults).length > 0 ? seoDefaults : null,
    maintenanceMode: values.maintenanceMode,
  };
}

export function toSettingsFormValues(settings: {
  siteName: string;
  siteDescription: string | null;
  logoUrl: string | null;
  faviconUrl: string | null;
  contactEmail: string | null;
  socialLinks: Record<string, string> | null;
  seoDefaults: Record<string, unknown> | null;
  maintenanceMode: boolean;
}): SettingsFormValues {
  const seoDefaults = settings.seoDefaults ?? {};

  return {
    siteName: settings.siteName,
    siteDescription: settings.siteDescription ?? '',
    logoUrl: settings.logoUrl ?? '',
    faviconUrl: settings.faviconUrl ?? '',
    contactEmail: settings.contactEmail ?? '',
    linkedinUrl: settings.socialLinks?.linkedin ?? '',
    githubUrl: settings.socialLinks?.github ?? '',
    twitterUrl: settings.socialLinks?.twitter ?? '',
    seoTitle: typeof seoDefaults.title === 'string' ? seoDefaults.title : '',
    seoDescription: typeof seoDefaults.description === 'string' ? seoDefaults.description : '',
    maintenanceMode: settings.maintenanceMode,
  };
}

export const settingsFormDefaultValues: SettingsFormValues = {
  siteName: '',
  siteDescription: '',
  logoUrl: '',
  faviconUrl: '',
  contactEmail: '',
  linkedinUrl: '',
  githubUrl: '',
  twitterUrl: '',
  seoTitle: '',
  seoDescription: '',
  maintenanceMode: false,
};
