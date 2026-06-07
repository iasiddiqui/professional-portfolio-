import type { SiteEmailTemplates } from '@/features/settings/types/email-templates.types';

export const DEFAULT_CONTACT_EMAIL_TEMPLATE = {
  subject: 'Thanks for connecting — {{owner}}',
  title: 'Thanks for reaching out',
  greeting: 'Hi {{name}},',
  intro:
    'Thank you for connecting with me. I have received your message and appreciate you taking the time to reach out.',
  nextStep:
    '{{owner}} will review your message and get back to you soon — usually within one business day.',
  closing: 'Best regards,\n{{owner}}',
  footer: 'You received this email because you submitted the contact form on {{siteName}}.',
  successMessage:
    'Thank you for connecting. {{owner}} will get back to you soon. A confirmation has been sent to your email.',
};

export const DEFAULT_HIRE_ME_EMAIL_TEMPLATE = {
  subject: 'Thanks for your hire request — {{owner}}',
  title: 'Thanks for reaching out',
  greeting: 'Hi {{name}},',
  intro:
    'Thank you for reaching out about a project. I have received your hire request and will review the scope, timeline, and details you shared.',
  nextStep: '{{owner}} will get back to you soon with availability and next steps.',
  closing: 'Best regards,\n{{owner}}',
  footer: 'You received this email because you submitted the hire me form on {{siteName}}.',
  successMessage:
    'Thank you for your hire request. {{owner}} will get back to you soon. A confirmation has been sent to your email.',
};

export const DEFAULT_CONSULTATION_EMAIL_TEMPLATE = {
  subject: 'Thanks for your consultation request — {{owner}}',
  title: 'Thanks for reaching out',
  greeting: 'Hi {{name}},',
  intro:
    'Thank you for requesting a consultation. I have received your message and appreciate you getting in touch.',
  nextStep: '{{owner}} will follow up shortly to confirm timing and discuss your goals.',
  closing: 'Best regards,\n{{owner}}',
  footer: 'You received this email because you submitted the consultation form on {{siteName}}.',
  successMessage:
    'Thank you for your consultation request. {{owner}} will get back to you soon. A confirmation has been sent to your email.',
};

export const DEFAULT_ADMIN_EMAIL_TEMPLATE = {
  subject: 'New message from {{name}} — {{siteName}}',
  title: 'New inquiry received',
  intro: 'A new inquiry was submitted via {{source}}.',
  footer: 'Review and respond from your admin dashboard.',
};

export const DEFAULT_SITE_EMAIL_TEMPLATES: SiteEmailTemplates = {
  contact: DEFAULT_CONTACT_EMAIL_TEMPLATE,
  hireMe: DEFAULT_HIRE_ME_EMAIL_TEMPLATE,
  consultation: DEFAULT_CONSULTATION_EMAIL_TEMPLATE,
  admin: DEFAULT_ADMIN_EMAIL_TEMPLATE,
};
