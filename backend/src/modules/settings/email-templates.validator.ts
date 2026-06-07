import { z } from 'zod';

const optionalTemplateField = z
  .union([z.string().trim().max(2000), z.literal(''), z.null()])
  .optional()
  .transform((value) => (value === '' ? null : value ?? null));

const leadConfirmationTemplateSchema = z.object({
  subject: optionalTemplateField,
  title: optionalTemplateField,
  greeting: optionalTemplateField,
  intro: optionalTemplateField,
  nextStep: optionalTemplateField,
  closing: optionalTemplateField,
  footer: optionalTemplateField,
  successMessage: optionalTemplateField,
});

const adminNotificationTemplateSchema = z.object({
  subject: optionalTemplateField,
  title: optionalTemplateField,
  intro: optionalTemplateField,
  footer: optionalTemplateField,
});

export const emailTemplatesSchema = z
  .object({
    contact: leadConfirmationTemplateSchema.optional(),
    hireMe: leadConfirmationTemplateSchema.optional(),
    consultation: leadConfirmationTemplateSchema.optional(),
    admin: adminNotificationTemplateSchema.optional(),
  })
  .nullable()
  .optional();

export type EmailTemplatesInput = z.infer<typeof emailTemplatesSchema>;
