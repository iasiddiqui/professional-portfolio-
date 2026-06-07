import type { LeadSource } from '@prisma/client';

export interface LeadEmailPayload {
  id: string;
  name: string;
  email: string;
  company?: string | null;
  budget?: string | null;
  projectType?: string | null;
  timeline?: string | null;
  preferredTime?: string | null;
  message: string;
  source?: LeadSource;
  createdAt: Date;
}

export interface LeadConfirmationTemplateCopy {
  subject?: string | null;
  title?: string | null;
  greeting?: string | null;
  intro?: string | null;
  nextStep?: string | null;
  closing?: string | null;
  footer?: string | null;
  successMessage?: string | null;
}

export interface AdminNotificationTemplateCopy {
  subject?: string | null;
  title?: string | null;
  intro?: string | null;
  footer?: string | null;
}

export interface SiteEmailTemplates {
  contact?: LeadConfirmationTemplateCopy | null;
  hireMe?: LeadConfirmationTemplateCopy | null;
  consultation?: LeadConfirmationTemplateCopy | null;
  admin?: AdminNotificationTemplateCopy | null;
}

export type EmailTemplateLeadSourceKey = 'contact' | 'hireMe' | 'consultation';

export interface EmailTemplateVariables {
  name: string;
  firstName: string;
  email: string;
  owner: string;
  siteName: string;
  message: string;
  subject: string;
  projectType: string;
  budget: string;
  timeline: string;
  preferredTime: string;
  source: string;
}

export const EMAIL_TEMPLATE_PLACEHOLDERS = [
  '{{name}}',
  '{{firstName}}',
  '{{email}}',
  '{{owner}}',
  '{{siteName}}',
  '{{message}}',
  '{{subject}}',
  '{{projectType}}',
  '{{budget}}',
  '{{timeline}}',
  '{{preferredTime}}',
  '{{source}}',
] as const;
