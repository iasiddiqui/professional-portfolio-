import type { LeadSource } from '@prisma/client';

import {
  buildTemplateVariables,
  getAdminTemplateCopy,
  getConfirmationTemplateCopy,
  renderClosingHtml,
  renderTemplateString,
  textToHtmlParagraphs,
} from './email-template.utils.js';
import type { LeadEmailPayload, SiteEmailTemplates } from './email-templates.types.js';

export type { LeadEmailPayload } from './email-templates.types.js';

export interface EmailTemplateResult {
  subject: string;
  html: string;
}

const SOURCE_LABELS: Record<LeadSource, string> = {
  CONTACT: 'Contact form',
  HIRE_ME: 'Hire Me form',
  CONSULTATION: 'Consultation request',
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatOptionalRow(label: string, value?: string | null): string {
  if (!value?.trim()) return '';
  return `
    <tr>
      <td style="padding:10px 0;color:#737373;font-size:13px;width:130px;vertical-align:top;">${label}</td>
      <td style="padding:10px 0;color:#171717;font-size:14px;vertical-align:top;">${escapeHtml(value)}</td>
    </tr>
  `;
}

function wrapEmailTemplate(options: {
  title: string;
  preheader: string;
  body: string;
  footer?: string;
  siteName: string;
}): string {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(options.title)}</title>
  </head>
  <body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <span style="display:none!important;visibility:hidden;opacity:0;height:0;width:0;">${escapeHtml(options.preheader)}</span>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f4f5;padding:40px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;">
            <tr>
              <td style="padding:0 0 20px;text-align:center;">
                <p style="margin:0;font-size:13px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#737373;">${escapeHtml(options.siteName)}</p>
              </td>
            </tr>
            <tr>
              <td>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#ffffff;border:1px solid #e4e4e7;border-radius:20px;overflow:hidden;box-shadow:0 1px 2px rgba(0,0,0,0.04);">
                  <tr>
                    <td style="padding:36px 36px 8px;">
                      <h1 style="margin:0;font-size:26px;line-height:1.25;font-weight:600;color:#0a0a0a;letter-spacing:-0.02em;">${escapeHtml(options.title)}</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:12px 36px 32px;color:#52525b;font-size:16px;line-height:1.75;">
                      ${options.body}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 8px 0;text-align:center;color:#a1a1aa;font-size:12px;line-height:1.6;">
                ${options.footer ?? `Sent from ${escapeHtml(options.siteName)}`}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function getSourceLabel(source?: LeadSource): string {
  if (!source) return 'Contact form';
  return SOURCE_LABELS[source];
}

function buildSubmissionSummary(lead: LeadEmailPayload): string {
  const rows = [
    formatOptionalRow('Subject', lead.company),
    formatOptionalRow('Project type', lead.projectType),
    formatOptionalRow('Budget', lead.budget),
    formatOptionalRow('Timeline', lead.timeline),
    formatOptionalRow('Preferred time', lead.preferredTime),
  ].filter(Boolean);

  if (rows.length === 0) return '';

  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:28px 0 0;background:#fafafa;border:1px solid #ececec;border-radius:14px;">
      <tr>
        <td style="padding:18px 20px 8px;">
          <p style="margin:0 0 4px;font-size:12px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#737373;">Your submission</p>
        </td>
      </tr>
      <tr>
        <td style="padding:0 20px 18px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            ${rows.join('')}
          </table>
        </td>
      </tr>
    </table>
  `;
}

export function buildLeadAdminNotificationTemplate(
  lead: LeadEmailPayload,
  siteName: string,
  emailTemplates: SiteEmailTemplates
): EmailTemplateResult {
  const sourceLabel = getSourceLabel(lead.source);
  const variables = buildTemplateVariables(lead, siteName);
  const copy = getAdminTemplateCopy(emailTemplates);

  const subject = renderTemplateString(
    copy.subject,
    variables,
    `New message from ${lead.name} — ${siteName}`
  );
  const title = renderTemplateString(copy.title, variables, 'New inquiry received');
  const intro = renderTemplateString(
    copy.intro,
    variables,
    `A new inquiry was submitted via ${sourceLabel}.`
  );
  const footer = renderTemplateString(
    copy.footer,
    variables,
    'Review and respond from your admin dashboard.'
  );

  const body = `
    <p style="margin:0 0 20px;">${escapeHtml(intro)}</p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#fafafa;border:1px solid #ececec;border-radius:14px;">
      <tr>
        <td style="padding:18px 20px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            ${formatOptionalRow('Source', sourceLabel)}
            ${formatOptionalRow('Name', lead.name)}
            ${formatOptionalRow('Email', lead.email)}
            ${formatOptionalRow('Subject', lead.company)}
            ${formatOptionalRow('Budget', lead.budget)}
            ${formatOptionalRow('Project type', lead.projectType)}
            ${formatOptionalRow('Timeline', lead.timeline)}
            ${formatOptionalRow('Preferred time', lead.preferredTime)}
          </table>
        </td>
      </tr>
    </table>
    <p style="margin:28px 0 10px;font-size:13px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;color:#737373;">Message</p>
    <div style="background:#fafafa;border:1px solid #ececec;border-radius:14px;padding:18px 20px;white-space:pre-wrap;color:#404040;font-size:15px;line-height:1.7;">${escapeHtml(lead.message)}</div>
    <p style="margin:24px 0 0;font-size:12px;color:#a1a1aa;">Lead ID: ${escapeHtml(lead.id)}</p>
  `;

  return {
    subject,
    html: wrapEmailTemplate({
      title,
      preheader: `${lead.name} sent a new ${sourceLabel.toLowerCase()}.`,
      body,
      footer,
      siteName,
    }),
  };
}

export function buildLeadConfirmationTemplate(
  lead: LeadEmailPayload,
  siteName: string,
  emailTemplates: SiteEmailTemplates
): EmailTemplateResult {
  const source = lead.source ?? 'CONTACT';
  const sourceLabel = getSourceLabel(source);
  const variables = buildTemplateVariables(lead, siteName);
  const copy = getConfirmationTemplateCopy(emailTemplates, source);

  const subject = renderTemplateString(copy.subject, variables, `Thanks for connecting — ${variables.owner}`);
  const title = renderTemplateString(copy.title, variables, 'Thanks for reaching out');
  const greeting = renderTemplateString(copy.greeting, variables, `Hi ${lead.name},`);
  const intro = renderTemplateString(
    copy.intro,
    variables,
    'Thank you for connecting. I have received your message and appreciate you reaching out.'
  );
  const nextStep = renderTemplateString(
    copy.nextStep,
    variables,
    `${variables.owner} will get back to you soon — typically within one business day.`
  );
  const closing = renderTemplateString(copy.closing, variables, `Best regards,\n${variables.owner}`);
  const footer = renderTemplateString(
    copy.footer,
    variables,
    `You received this email because you submitted the ${sourceLabel.toLowerCase()} on ${siteName}.`
  );

  const body = `
    ${textToHtmlParagraphs(greeting)}
    ${textToHtmlParagraphs(intro)}
    <p style="margin:0 0 0;padding:18px 20px;background:#fafafa;border:1px solid #ececec;border-radius:14px;color:#171717;font-size:15px;line-height:1.7;">
      ${escapeHtml(nextStep)}
    </p>
    ${buildSubmissionSummary(lead)}
    <p style="margin:28px 0 8px;font-size:13px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;color:#737373;">Your message</p>
    <div style="background:#fafafa;border:1px solid #ececec;border-radius:14px;padding:18px 20px;white-space:pre-wrap;color:#52525b;font-size:15px;line-height:1.7;">${escapeHtml(lead.message)}</div>
    ${renderClosingHtml(closing)}
  `;

  return {
    subject,
    html: wrapEmailTemplate({
      title,
      preheader: `${variables.owner} received your message and will get back to you soon.`,
      body,
      footer,
      siteName,
    }),
  };
}
