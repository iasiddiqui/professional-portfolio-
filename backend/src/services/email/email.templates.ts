export interface LeadEmailPayload {
  id: string;
  name: string;
  email: string;
  company?: string | null;
  budget?: string | null;
  projectType?: string | null;
  message: string;
  createdAt: Date;
}

export interface EmailTemplateResult {
  subject: string;
  html: string;
}

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
      <td style="padding:8px 0;color:#737373;font-size:13px;width:140px;vertical-align:top;">${label}</td>
      <td style="padding:8px 0;color:#0a0a0a;font-size:14px;vertical-align:top;">${escapeHtml(value)}</td>
    </tr>
  `;
}

function wrapEmailTemplate(options: {
  title: string;
  preheader: string;
  body: string;
  footer?: string;
}): string {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(options.title)}</title>
  </head>
  <body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <span style="display:none!important;visibility:hidden;opacity:0;height:0;width:0;">${escapeHtml(options.preheader)}</span>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f5f5;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border:1px solid #e5e5e5;border-radius:16px;overflow:hidden;">
            <tr>
              <td style="padding:28px 32px 12px;border-bottom:1px solid #f0f0f0;">
                <p style="margin:0 0 8px;font-size:12px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#dc2626;">Portfolio</p>
                <h1 style="margin:0;font-size:24px;line-height:1.3;color:#0a0a0a;">${escapeHtml(options.title)}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 32px;color:#404040;font-size:15px;line-height:1.7;">
                ${options.body}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px 28px;border-top:1px solid #f0f0f0;color:#737373;font-size:12px;line-height:1.6;">
                ${options.footer ?? 'This message was sent from your portfolio contact system.'}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function buildLeadAdminNotificationTemplate(
  lead: LeadEmailPayload,
  siteName: string
): EmailTemplateResult {
  const body = `
    <p style="margin:0 0 20px;">A new inquiry was submitted on <strong>${escapeHtml(siteName)}</strong>.</p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#fafafa;border:1px solid #ececec;border-radius:12px;padding:4px 16px;">
      ${formatOptionalRow('Name', lead.name)}
      ${formatOptionalRow('Email', lead.email)}
      ${formatOptionalRow('Company', lead.company)}
      ${formatOptionalRow('Budget', lead.budget)}
      ${formatOptionalRow('Project type', lead.projectType)}
    </table>
    <p style="margin:24px 0 8px;font-size:13px;font-weight:600;color:#0a0a0a;">Message</p>
    <div style="background:#fafafa;border:1px solid #ececec;border-radius:12px;padding:16px;white-space:pre-wrap;color:#404040;">${escapeHtml(lead.message)}</div>
    <p style="margin:24px 0 0;font-size:12px;color:#737373;">Lead ID: ${escapeHtml(lead.id)}</p>
  `;

  return {
    subject: `New contact inquiry from ${lead.name}`,
    html: wrapEmailTemplate({
      title: 'New lead received',
      preheader: `${lead.name} submitted a new contact inquiry.`,
      body,
      footer: 'Review and respond from your admin dashboard.',
    }),
  };
}

export function buildLeadConfirmationTemplate(
  lead: LeadEmailPayload,
  siteName: string
): EmailTemplateResult {
  const body = `
    <p style="margin:0 0 16px;">Hi ${escapeHtml(lead.name)},</p>
    <p style="margin:0 0 16px;">Thanks for reaching out to <strong>${escapeHtml(siteName)}</strong>. Your message has been received and I'll get back to you as soon as possible.</p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#fafafa;border:1px solid #ececec;border-radius:12px;padding:4px 16px;margin-top:8px;">
      ${formatOptionalRow('Project type', lead.projectType)}
      ${formatOptionalRow('Budget', lead.budget)}
    </table>
    <p style="margin:24px 0 8px;font-size:13px;font-weight:600;color:#0a0a0a;">Your message</p>
    <div style="background:#fafafa;border:1px solid #ececec;border-radius:12px;padding:16px;white-space:pre-wrap;color:#404040;">${escapeHtml(lead.message)}</div>
    <p style="margin:24px 0 0;">Looking forward to connecting.</p>
  `;

  return {
    subject: `Thanks for contacting ${siteName}`,
    html: wrapEmailTemplate({
      title: 'Message received',
      preheader: `We received your inquiry and will respond soon.`,
      body,
      footer: `You are receiving this email because you submitted the contact form on ${escapeHtml(siteName)}.`,
    }),
  };
}
