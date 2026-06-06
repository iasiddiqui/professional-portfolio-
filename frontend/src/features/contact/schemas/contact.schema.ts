import { z } from 'zod';

export const contactFormSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(120, 'Name is too long'),
  email: z.string().trim().email('Enter a valid email address'),
  company: z.string().trim().max(120, 'Company name is too long').optional(),
  budget: z.string().trim().max(100, 'Budget is too long').optional(),
  projectType: z.string().trim().max(100).optional(),
  message: z
    .string()
    .trim()
    .min(10, 'Please provide at least 10 characters')
    .max(5000, 'Message is too long'),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
