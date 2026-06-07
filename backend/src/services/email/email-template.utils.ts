import type { LeadSource } from '@prisma/client';

import type { LeadEmailPayload } from './email-templates.types.js';
import {
  DEFAULT_ADMIN_NOTIFICATION,
  DEFAULT_CONSULTATION_CONFIRMATION,
  DEFAULT_CONTACT_CONFIRMATION,
  DEFAULT_HIRE_ME_CONFIRMATION,
  DEFAULT_SITE_EMAIL_TEMPLATES,
} from './email-templates.defaults.js';
import type {
  AdminNotificationTemplateCopy,
  EmailTemplateLeadSourceKey,
  EmailTemplateVariables,
  LeadConfirmationTemplateCopy,
  SiteEmailTemplates,
} from './email-templates.types.js';

const SOURCE_LABELS: Record<LeadSource, string> = {
  CONTACT: 'Contact form',
  HIRE_ME: 'Hire Me form',
  CONSULTATION: 'Consultation request',
};

function ownerFirstName(siteName: string): string {
  const first = siteName.trim().split(/\s+/)[0];
  return first || siteName;
}

function leadFirstName(name: string): string {
  const first = name.trim().split(/\s+/)[0];
  return first || name;
}

export function leadSourceToTemplateKey(source: LeadSource): EmailTemplateLeadSourceKey {
  if (source === 'HIRE_ME') return 'hireMe';
  if (source === 'CONSULTATION') return 'consultation';
  return 'contact';
}

export function parseSiteEmailTemplates(value: unknown): SiteEmailTemplates | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }

  return value as SiteEmailTemplates;
}

export function resolveSiteEmailTemplates(value: unknown): SiteEmailTemplates {
  const parsed = parseSiteEmailTemplates(value);
  if (!parsed) return DEFAULT_SITE_EMAIL_TEMPLATES;

  return {
    contact: { ...DEFAULT_CONTACT_CONFIRMATION, ...(parsed.contact ?? {}) },
    hireMe: { ...DEFAULT_HIRE_ME_CONFIRMATION, ...(parsed.hireMe ?? {}) },
    consultation: { ...DEFAULT_CONSULTATION_CONFIRMATION, ...(parsed.consultation ?? {}) },
    admin: { ...DEFAULT_ADMIN_NOTIFICATION, ...(parsed.admin ?? {}) },
  };
}

export function buildTemplateVariables(
  lead: LeadEmailPayload,
  siteName: string
): EmailTemplateVariables {
  const source = lead.source ?? 'CONTACT';

  return {
    name: lead.name,
    firstName: leadFirstName(lead.name),
    email: lead.email,
    owner: ownerFirstName(siteName),
    siteName,
    message: lead.message,
    subject: lead.company?.trim() ?? '',
    projectType: lead.projectType?.trim() ?? '',
    budget: lead.budget?.trim() ?? '',
    timeline: lead.timeline?.trim() ?? '',
    preferredTime: lead.preferredTime?.trim() ?? '',
    source: SOURCE_LABELS[source],
  };
}

export function renderTemplateString(
  template: string | null | undefined,
  variables: EmailTemplateVariables,
  fallback: string
): string {
  const source = template?.trim() || fallback;

  return source.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    const value = variables[key as keyof EmailTemplateVariables];
    return value != null ? String(value) : '';
  });
}

export function getConfirmationTemplateCopy(
  templates: SiteEmailTemplates,
  source: LeadSource
): LeadConfirmationTemplateCopy {
  const key = leadSourceToTemplateKey(source);
  const defaults =
    key === 'hireMe'
      ? DEFAULT_HIRE_ME_CONFIRMATION
      : key === 'consultation'
        ? DEFAULT_CONSULTATION_CONFIRMATION
        : DEFAULT_CONTACT_CONFIRMATION;

  return { ...defaults, ...(templates[key] ?? {}) };
}

export function getAdminTemplateCopy(templates: SiteEmailTemplates): AdminNotificationTemplateCopy {
  return { ...DEFAULT_ADMIN_NOTIFICATION, ...(templates.admin ?? {}) };
}

export function getConfirmationSuccessMessage(
  templates: SiteEmailTemplates,
  source: LeadSource,
  siteName: string,
  leadName: string
): string {
  const copy = getConfirmationTemplateCopy(templates, source);
  const variables = buildTemplateVariables(
    {
      id: '',
      name: leadName,
      email: '',
      message: '',
      source,
      createdAt: new Date(),
    },
    siteName
  );

  const key = leadSourceToTemplateKey(source);
  const fallback =
    key === 'hireMe'
      ? DEFAULT_HIRE_ME_CONFIRMATION.successMessage!
      : key === 'consultation'
        ? DEFAULT_CONSULTATION_CONFIRMATION.successMessage!
        : DEFAULT_CONTACT_CONFIRMATION.successMessage!;

  return renderTemplateString(copy.successMessage, variables, fallback);
}

export function textToHtmlParagraphs(text: string): string {
  return text
    .split(/\n{2,}|\n/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => `<p style="margin:0 0 16px;">${escapeHtml(part)}</p>`)
    .join('');
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function renderClosingHtml(text: string): string {
  const lines = text.split('\n').map((line) => line.trim()).filter(Boolean);
  if (lines.length === 0) return '';

  const [first, ...rest] = lines;
  return `
    <p style="margin:32px 0 0;color:#171717;">
      ${escapeHtml(first)}${rest.length ? '<br />' : ''}
      ${rest.map((line) => `<strong>${escapeHtml(line)}</strong>`).join('<br />')}
    </p>
  `;
}
