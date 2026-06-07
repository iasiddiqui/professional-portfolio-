'use client';

import { LeadInquiryForm } from '@/features/contact/components/lead-inquiry-form';

export function ContactForm() {
  return <LeadInquiryForm variant="contact" />;
}

export function HireMeForm() {
  return <LeadInquiryForm variant="hire-me" />;
}

export function ConsultationForm() {
  return <LeadInquiryForm variant="consultation" />;
}
