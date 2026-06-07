import { z } from 'zod';

import { DEFAULT_SITE_EMAIL_TEMPLATES } from '@/features/settings/constants/email-template-defaults';
import type { SiteEmailTemplates } from '@/features/settings/types/email-templates.types';

const optionalTemplateField = z.string().trim().max(2000);

const leadConfirmationFields = {
  subject: optionalTemplateField,
  title: optionalTemplateField,
  greeting: optionalTemplateField,
  intro: optionalTemplateField,
  nextStep: optionalTemplateField,
  closing: optionalTemplateField,
  footer: optionalTemplateField,
  successMessage: optionalTemplateField,
};

export const emailTemplatesFormSchema = z.object({
  contact: z.object(leadConfirmationFields),
  hireMe: z.object(leadConfirmationFields),
  consultation: z.object(leadConfirmationFields),
  admin: z.object({
    subject: optionalTemplateField,
    title: optionalTemplateField,
    intro: optionalTemplateField,
    footer: optionalTemplateField,
  }),
});

export type EmailTemplatesFormValues = z.infer<typeof emailTemplatesFormSchema>;

function leadConfirmationFromDefaults(
  defaults: NonNullable<SiteEmailTemplates['contact']>,
  saved?: SiteEmailTemplates['contact'] | null
) {
  return {
    subject: saved?.subject ?? defaults.subject ?? '',
    title: saved?.title ?? defaults.title ?? '',
    greeting: saved?.greeting ?? defaults.greeting ?? '',
    intro: saved?.intro ?? defaults.intro ?? '',
    nextStep: saved?.nextStep ?? defaults.nextStep ?? '',
    closing: saved?.closing ?? defaults.closing ?? '',
    footer: saved?.footer ?? defaults.footer ?? '',
    successMessage: saved?.successMessage ?? defaults.successMessage ?? '',
  };
}

export const emailTemplatesFormDefaultValues: EmailTemplatesFormValues = {
  contact: leadConfirmationFromDefaults(DEFAULT_SITE_EMAIL_TEMPLATES.contact!),
  hireMe: leadConfirmationFromDefaults(DEFAULT_SITE_EMAIL_TEMPLATES.hireMe!),
  consultation: leadConfirmationFromDefaults(DEFAULT_SITE_EMAIL_TEMPLATES.consultation!),
  admin: {
    subject: DEFAULT_SITE_EMAIL_TEMPLATES.admin?.subject ?? '',
    title: DEFAULT_SITE_EMAIL_TEMPLATES.admin?.title ?? '',
    intro: DEFAULT_SITE_EMAIL_TEMPLATES.admin?.intro ?? '',
    footer: DEFAULT_SITE_EMAIL_TEMPLATES.admin?.footer ?? '',
  },
};

export function toEmailTemplatesFormValues(emailTemplates: SiteEmailTemplates | null): EmailTemplatesFormValues {
  return {
    contact: leadConfirmationFromDefaults(DEFAULT_SITE_EMAIL_TEMPLATES.contact!, emailTemplates?.contact),
    hireMe: leadConfirmationFromDefaults(DEFAULT_SITE_EMAIL_TEMPLATES.hireMe!, emailTemplates?.hireMe),
    consultation: leadConfirmationFromDefaults(
      DEFAULT_SITE_EMAIL_TEMPLATES.consultation!,
      emailTemplates?.consultation
    ),
    admin: {
      subject: emailTemplates?.admin?.subject ?? DEFAULT_SITE_EMAIL_TEMPLATES.admin?.subject ?? '',
      title: emailTemplates?.admin?.title ?? DEFAULT_SITE_EMAIL_TEMPLATES.admin?.title ?? '',
      intro: emailTemplates?.admin?.intro ?? DEFAULT_SITE_EMAIL_TEMPLATES.admin?.intro ?? '',
      footer: emailTemplates?.admin?.footer ?? DEFAULT_SITE_EMAIL_TEMPLATES.admin?.footer ?? '',
    },
  };
}

function stripEmptyLeadConfirmation(values: EmailTemplatesFormValues['contact']) {
  const payload: Record<string, string> = {};
  (Object.entries(values) as Array<[keyof typeof values, string]>).forEach(([key, value]) => {
    if (value.trim()) payload[key] = value.trim();
  });
  return Object.keys(payload).length > 0 ? payload : null;
}

function stripEmptyAdmin(values: EmailTemplatesFormValues['admin']) {
  const payload: Record<string, string> = {};
  (Object.entries(values) as Array<[keyof typeof values, string]>).forEach(([key, value]) => {
    if (value.trim()) payload[key] = value.trim();
  });
  return Object.keys(payload).length > 0 ? payload : null;
}

export function toEmailTemplatesPayload(
  values: EmailTemplatesFormValues,
  existing: SiteEmailTemplates | null
): SiteEmailTemplates {
  const nextContact = stripEmptyLeadConfirmation(values.contact);
  const nextHireMe = stripEmptyLeadConfirmation(values.hireMe);
  const nextConsultation = stripEmptyLeadConfirmation(values.consultation);
  const nextAdmin = stripEmptyAdmin(values.admin);

  return {
    contact: nextContact ?? existing?.contact ?? DEFAULT_SITE_EMAIL_TEMPLATES.contact ?? null,
    hireMe: nextHireMe ?? existing?.hireMe ?? DEFAULT_SITE_EMAIL_TEMPLATES.hireMe ?? null,
    consultation:
      nextConsultation ?? existing?.consultation ?? DEFAULT_SITE_EMAIL_TEMPLATES.consultation ?? null,
    admin: nextAdmin ?? existing?.admin ?? DEFAULT_SITE_EMAIL_TEMPLATES.admin ?? null,
  };
}
