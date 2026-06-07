import { Resend, type CreateEmailOptions } from 'resend';

import { env, requireEnvValue } from '../../config/env.js';
import { logger } from '../../utils/logger.js';
import {
  buildLeadAdminNotificationTemplate,
  buildLeadConfirmationTemplate,
} from './email.templates.js';
import { resolveSiteEmailTemplates } from './email-template.utils.js';
import type { LeadEmailPayload, SiteEmailTemplates } from './email-templates.types.js';

let resendClient: Resend | null = null;

function getResendClient(): Resend {
  if (!resendClient) {
    resendClient = new Resend(requireEnvValue(env.RESEND_API_KEY, 'RESEND_API_KEY'));
  }

  return resendClient;
}

export interface SendLeadEmailsInput {
  lead: LeadEmailPayload;
  siteName: string;
  notificationEmail: string;
  emailTemplates?: SiteEmailTemplates | null;
}

export interface SendLeadEmailsResult {
  adminSent: boolean;
  confirmationSent: boolean;
}

async function sendResendEmail(
  resend: Resend,
  payload: CreateEmailOptions,
  context: { leadId: string; kind: 'admin' | 'confirmation' }
): Promise<boolean> {
  try {
    const { data, error } = await resend.emails.send(payload);

    if (error) {
      logger.error('Resend rejected email', {
        leadId: context.leadId,
        kind: context.kind,
        to: payload.to,
        error: error.message,
      });
      return false;
    }

    if (!data?.id) {
      logger.error('Resend returned no email id', {
        leadId: context.leadId,
        kind: context.kind,
        to: payload.to,
      });
      return false;
    }

    return true;
  } catch (error) {
    logger.error('Resend send failed', {
      leadId: context.leadId,
      kind: context.kind,
      to: payload.to,
      error: error instanceof Error ? error.message : String(error),
    });
    return false;
  }
}

export class EmailService {
  async sendLeadEmails(input: SendLeadEmailsInput): Promise<SendLeadEmailsResult> {
    if (!env.RESEND_API_KEY) {
      logger.warn('RESEND_API_KEY is not configured; skipping lead emails', {
        leadId: input.lead.id,
      });
      return { adminSent: false, confirmationSent: false };
    }

    const resend = getResendClient();
    const templates = resolveSiteEmailTemplates(input.emailTemplates);
    const adminTemplate = buildLeadAdminNotificationTemplate(input.lead, input.siteName, templates);
    const confirmationTemplate = buildLeadConfirmationTemplate(input.lead, input.siteName, templates);
    const leadId = input.lead.id;

    const [adminSent, confirmationSent] = await Promise.all([
      sendResendEmail(
        resend,
        {
          from: env.RESEND_FROM_EMAIL,
          to: input.notificationEmail,
          replyTo: input.lead.email,
          subject: adminTemplate.subject,
          html: adminTemplate.html,
        },
        { leadId, kind: 'admin' }
      ),
      sendResendEmail(
        resend,
        {
          from: env.RESEND_FROM_EMAIL,
          to: input.lead.email,
          subject: confirmationTemplate.subject,
          html: confirmationTemplate.html,
        },
        { leadId, kind: 'confirmation' }
      ),
    ]);

    return { adminSent, confirmationSent };
  }
}

export const emailService = new EmailService();
