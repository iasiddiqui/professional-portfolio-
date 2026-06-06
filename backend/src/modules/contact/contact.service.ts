import { LeadStatus } from '@prisma/client';

import { env } from '../../config/env.js';
import { leadRepository } from '../../repositories/lead.repository.js';
import { siteContentRepository } from '../../repositories/site-content.repository.js';
import { emailService } from '../../services/email/email.service.js';
import { logger } from '../../utils/logger.js';
import type { PublicContactInput } from '../public/public.validator.js';

export interface ContactSubmissionResult {
  id: string;
  message: string;
  emailSent: boolean;
}

export class ContactService {
  async submitContact(input: PublicContactInput): Promise<ContactSubmissionResult> {
    const lead = await leadRepository.create({
      name: input.name,
      email: input.email,
      company: input.company ?? null,
      budget: input.budget ?? null,
      projectType: input.projectType ?? null,
      message: input.message,
      status: LeadStatus.NEW,
    });

    const site = await siteContentRepository.getSiteSettings();
    const siteName = site?.siteName ?? 'Portfolio';
    const notificationEmail =
      env.CONTACT_NOTIFICATION_EMAIL ?? site?.contactEmail ?? env.ADMIN_EMAIL ?? null;

    let emailSent = false;

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
            message: lead.message,
            createdAt: lead.createdAt,
          },
          siteName,
          notificationEmail,
        });

        emailSent = result.adminSent || result.confirmationSent;
      } catch (error) {
        logger.error('Contact email dispatch failed', {
          leadId: lead.id,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    } else {
      logger.warn('Contact notification email skipped — no recipient configured', {
        leadId: lead.id,
      });
    }

    return {
      id: lead.id,
      message: emailSent
        ? 'Thank you for reaching out. A confirmation has been sent to your email.'
        : 'Thank you for reaching out. We will get back to you soon.',
      emailSent,
    };
  }
}

export const contactService = new ContactService();
