import { z } from 'zod';

import {
  projectTypeSchemaFields,
  refineProjectTypeOther,
} from '@/features/contact/schemas/project-type.schema';

export const contactFormSchema = z
  .object({
    name: z.string().trim().min(1, 'Name is required').max(120, 'Name is too long'),
    email: z.string().trim().email('Enter a valid email address'),
    company: z.string().trim().max(120, 'Subject is too long').optional(),
    ...projectTypeSchemaFields,
    message: z
      .string()
      .trim()
      .min(10, 'Please provide at least 10 characters')
      .max(5000, 'Message is too long'),
  })
  .superRefine(refineProjectTypeOther);

export type ContactFormValues = z.infer<typeof contactFormSchema>;
