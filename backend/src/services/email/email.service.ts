import { Resend } from 'resend';

import { env, requireEnvValue } from '../../config/env.js';
import { logger } from '../../utils/logger.js';
import {
  buildLeadAdminNotificationTemplate,
  buildLeadConfirmationTemplate,
  type LeadEmailPayload,
} from './email.templates.js';

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
}

export interface SendLeadEmailsResult {
  adminSent: boolean;
  confirmationSent: boolean;
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
    const adminTemplate = buildLeadAdminNotificationTemplate(input.lead, input.siteName);
    const confirmationTemplate = buildLeadConfirmationTemplate(input.lead, input.siteName);

    const [adminResult, confirmationResult] = await Promise.allSettled([
      resend.emails.send({
        from: env.RESEND_FROM_EMAIL,
        to: input.notificationEmail,
        replyTo: input.lead.email,
        subject: adminTemplate.subject,
        html: adminTemplate.html,
      }),
      resend.emails.send({
        from: env.RESEND_FROM_EMAIL,
        to: input.lead.email,
        subject: confirmationTemplate.subject,
        html: confirmationTemplate.html,
      }),
    ]);

    const adminSent = adminResult.status === 'fulfilled';
    const confirmationSent = confirmationResult.status === 'fulfilled';

    if (!adminSent) {
      logger.error('Failed to send admin lead notification email', {
        leadId: input.lead.id,
        error:
          adminResult.status === 'rejected'
            ? String(adminResult.reason)
            : 'Unknown email failure',
      });
    }

    if (!confirmationSent) {
      logger.error('Failed to send lead confirmation email', {
        leadId: input.lead.id,
        error:
          confirmationResult.status === 'rejected'
            ? String(confirmationResult.reason)
            : 'Unknown email failure',
      });
    }

    return { adminSent, confirmationSent };
  }
}

export const emailService = new EmailService();
