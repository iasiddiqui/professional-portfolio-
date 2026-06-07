import { z } from 'zod';

import { emailTemplatesSchema } from './email-templates.validator.js';

const optionalUrlSchema = z
  .union([z.string().url(), z.literal(''), z.null()])
  .optional()
  .transform((value) => (value === '' ? null : value ?? null));

const settingsFieldsSchema = z.object({
  siteName: z.string().trim().min(1).max(200),
  siteDescription: z.string().trim().max(500).nullable().optional(),
  logoUrl: optionalUrlSchema,
  faviconUrl: optionalUrlSchema,
  contactEmail: z.union([z.string().trim().email(), z.literal(''), z.null()]).optional().transform(
    (value) => (value === '' ? null : value ?? null)
  ),
  socialLinks: z.record(z.string(), z.string()).nullable().optional(),
  seoDefaults: z.record(z.string(), z.unknown()).nullable().optional(),
  emailTemplates: emailTemplatesSchema,
  maintenanceMode: z.boolean().default(false),
});

export const updateSettingsSchema = settingsFieldsSchema.partial();

export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
