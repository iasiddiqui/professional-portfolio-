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

export const EMAIL_TEMPLATE_PLACEHOLDERS =
  '{{name}}, {{firstName}}, {{email}}, {{owner}}, {{siteName}}, {{message}}, {{subject}}, {{projectType}}, {{budget}}, {{timeline}}, {{preferredTime}}, {{source}}';

export type EmailTemplateTab = 'contact' | 'hireMe' | 'consultation' | 'admin';

export const EMAIL_TEMPLATE_TABS: Array<{ id: EmailTemplateTab; label: string; description: string }> = [
  {
    id: 'contact',
    label: 'Contact',
    description: 'Confirmation email and success message for the contact form.',
  },
  {
    id: 'hireMe',
    label: 'Hire Me',
    description: 'Confirmation email and success message for hire requests.',
  },
  {
    id: 'consultation',
    label: 'Consultation',
    description: 'Confirmation email and success message for consultation requests.',
  },
  {
    id: 'admin',
    label: 'Admin alert',
    description: 'Email sent to you when a new inquiry is received.',
  },
];
