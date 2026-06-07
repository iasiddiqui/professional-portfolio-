import { LeadSource } from '@prisma/client';

import { leadIntakeService } from '../../services/lead-intake.service.js';
import type { PublicContactInput } from '../public/public.validator.js';

export interface ContactSubmissionResult {
  id: string;
  message: string;
  emailSent: boolean;
}

export class ContactService {
  async submitContact(input: PublicContactInput): Promise<ContactSubmissionResult> {
    const result = await leadIntakeService.submit({
      name: input.name,
      email: input.email,
      company: input.company ?? null,
      budget: input.budget ?? null,
      projectType: input.projectType ?? null,
      message: input.message,
      source: LeadSource.CONTACT,
    });

    return {
      id: result.id,
      message: result.message,
      emailSent: result.confirmationEmailSent,
    };
  }

  async submitHireMe(input: PublicContactInput & { timeline?: string }): Promise<ContactSubmissionResult> {
    const result = await leadIntakeService.submit({
      name: input.name,
      email: input.email,
      company: input.company ?? null,
      budget: input.budget ?? null,
      projectType: input.projectType ?? null,
      timeline: input.timeline ?? null,
      message: input.message,
      source: LeadSource.HIRE_ME,
    });

    return {
      id: result.id,
      message: result.message,
      emailSent: result.confirmationEmailSent,
    };
  }

  async submitConsultation(
    input: Omit<PublicContactInput, 'budget'> & { preferredTime?: string }
  ): Promise<ContactSubmissionResult> {
    const result = await leadIntakeService.submit({
      name: input.name,
      email: input.email,
      company: input.company ?? null,
      projectType: input.projectType ?? null,
      preferredTime: input.preferredTime ?? null,
      message: input.message,
      source: LeadSource.CONSULTATION,
    });

    return {
      id: result.id,
      message: result.message,
      emailSent: result.confirmationEmailSent,
    };
  }
}

export const contactService = new ContactService();
