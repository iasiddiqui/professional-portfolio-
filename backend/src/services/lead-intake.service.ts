import { LeadSource, LeadStatus } from '@prisma/client';

import { env } from '../config/env.js';
import { leadRepository } from '../repositories/lead.repository.js';
import { siteContentRepository } from '../repositories/site-content.repository.js';
import { emailService } from './email/email.service.js';
import {
  getConfirmationSuccessMessage,
  resolveSiteEmailTemplates,
} from './email/email-template.utils.js';
import { logger } from '../utils/logger.js';

export interface LeadIntakeInput {
  name: string;
  email: string;
  company?: string | null;
  budget?: string | null;
  projectType?: string | null;
  timeline?: string | null;
  preferredTime?: string | null;
  message: string;
  source: LeadSource;
}

export interface LeadIntakeResult {
  id: string;
  message: string;
  emailSent: boolean;
  adminEmailSent: boolean;
  confirmationEmailSent: boolean;
}

const FALLBACK_MESSAGES: Record<LeadSource, string> = {
  [LeadSource.CONTACT]: 'Thank you for connecting. We will get back to you soon.',
  [LeadSource.HIRE_ME]: 'Thank you for your interest. We will review your request and respond soon.',
  [LeadSource.CONSULTATION]:
    'Thank you for your consultation request. We will confirm availability shortly.',
};

export class LeadIntakeService {
  async submit(input: LeadIntakeInput): Promise<LeadIntakeResult> {
    const lead = await leadRepository.create({
      name: input.name,
      email: input.email,
      company: input.company ?? null,
      budget: input.budget ?? null,
      projectType: input.projectType ?? null,
      timeline: input.timeline ?? null,
      preferredTime: input.preferredTime ?? null,
      message: input.message,
      source: input.source,
      status: LeadStatus.NEW,
    });

    const site = await siteContentRepository.getSiteSettings();
    const siteName = site?.siteName ?? 'Portfolio';
    const emailTemplates = resolveSiteEmailTemplates(site?.emailTemplates);
    const notificationEmail =
      env.CONTACT_NOTIFICATION_EMAIL ?? site?.contactEmail ?? env.ADMIN_EMAIL ?? null;

    let adminEmailSent = false;
    let confirmationEmailSent = false;

    if (notificationEmail) {
      try {
        const result = await emailService.sendLeadEmails({
          lead: {
            id: lead.id,
            name: lead.name,
            email: lead.email,
            company: lead.company,
            budget: lead.budget,
            projectType: lead.projectType,
            timeline: lead.timeline,
            preferredTime: lead.preferredTime,
            message: lead.message,
            source: lead.source,
            createdAt: lead.createdAt,
          },
          siteName,
          notificationEmail,
          emailTemplates,
        });

        adminEmailSent = result.adminSent;
        confirmationEmailSent = result.confirmationSent;

        if (adminEmailSent || confirmationEmailSent) {
          await leadRepository.updateEmailFlags(lead.id, {
            adminEmailSent,
            confirmationEmailSent,
          });
        }
      } catch (error) {
        logger.error('Lead email dispatch failed', {
          leadId: lead.id,
          source: input.source,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    } else {
      logger.warn('Lead notification email skipped — no recipient configured', {
        leadId: lead.id,
        source: input.source,
      });
    }

    const emailSent = confirmationEmailSent;

    return {
      id: lead.id,
      message: confirmationEmailSent
        ? getConfirmationSuccessMessage(emailTemplates, input.source, siteName, lead.name)
        : FALLBACK_MESSAGES[input.source],
      emailSent,
      adminEmailSent,
      confirmationEmailSent,
    };
  }
}

export const leadIntakeService = new LeadIntakeService();
