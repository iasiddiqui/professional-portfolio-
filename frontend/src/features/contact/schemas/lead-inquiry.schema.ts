import { z } from 'zod';

import {
  projectTypeSchemaFields,
  refineProjectTypeOther,
} from '@/features/contact/schemas/project-type.schema';

export const hireMeFormSchema = z
  .object({
    name: z.string().trim().min(1, 'Name is required').max(120, 'Name is too long'),
    email: z.string().trim().email('Enter a valid email address'),
    company: z.string().trim().max(120, 'Subject is too long').optional(),
    budget: z.string().trim().max(100, 'Budget is too long').optional(),
    ...projectTypeSchemaFields,
    timeline: z.string().trim().max(200, 'Timeline is too long').optional(),
    message: z
      .string()
      .trim()
      .min(10, 'Please provide at least 10 characters')
      .max(5000, 'Message is too long'),
  })
  .superRefine(refineProjectTypeOther);

export type HireMeFormValues = z.infer<typeof hireMeFormSchema>;

export const consultationFormSchema = z
  .object({
    name: z.string().trim().min(1, 'Name is required').max(120, 'Name is too long'),
    email: z.string().trim().email('Enter a valid email address'),
    company: z.string().trim().max(120, 'Subject is too long').optional(),
    ...projectTypeSchemaFields,
    preferredTime: z.string().trim().max(200, 'Preferred time is too long').optional(),
    message: z
      .string()
      .trim()
      .min(10, 'Please provide at least 10 characters')
      .max(5000, 'Message is too long'),
  })
  .superRefine(refineProjectTypeOther);

export type ConsultationFormValues = z.infer<typeof consultationFormSchema>;

export type LeadInquiryVariant = 'contact' | 'hire-me' | 'consultation';

export interface LeadInquiryFormConfig {
  variant: LeadInquiryVariant;
  title: string;
  description: string;
  submitLabel: string;
  successTitle: string;
  resetLabel: string;
}

export const LEAD_INQUIRY_FORM_CONFIG: Record<LeadInquiryVariant, LeadInquiryFormConfig> = {
  contact: {
    variant: 'contact',
    title: 'Send a message',
    description: "Share your project goals and I'll respond within one business day.",
    submitLabel: 'Send message',
    successTitle: 'Message sent',
    resetLabel: 'Send another message',
  },
  'hire-me': {
    variant: 'hire-me',
    title: 'Hire me for your project',
    description: 'Tell me about the role, scope, and timeline. I review every hire request personally.',
    submitLabel: 'Submit hire request',
    successTitle: 'Hire request sent',
    resetLabel: 'Submit another request',
  },
  consultation: {
    variant: 'consultation',
    title: 'Book a consultation',
    description: 'Request a strategy or technical consultation. Share context and preferred times.',
    submitLabel: 'Request consultation',
    successTitle: 'Consultation requested',
    resetLabel: 'Submit another request',
  },
};
