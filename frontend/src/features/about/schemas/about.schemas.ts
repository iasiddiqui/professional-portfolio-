import { z } from 'zod';

export const aboutHeroSchema = z.object({
  siteDescription: z.string().trim().min(1, 'Intro text is required').max(500),
});

export type AboutHeroFormValues = z.infer<typeof aboutHeroSchema>;

export const aboutTimelineEntrySchema = z.object({
  role: z.string().trim().min(1, 'This field is required').max(200),
  organization: z.string().trim().min(1, 'This field is required').max(200),
  period: z.string().trim().min(1, 'Period is required').max(200),
  content: z.string().trim().min(1, 'Content is required'),
});

export type AboutTimelineEntryFormValues = z.infer<typeof aboutTimelineEntrySchema>;

export const aboutTextSectionSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200),
  body: z.string().trim().min(1, 'Content is required'),
  active: z.boolean(),
});

export type AboutTextSectionFormValues = z.infer<typeof aboutTextSectionSchema>;

export const aboutTimelineSectionSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200),
  entries: z.array(aboutTimelineEntrySchema).min(1, 'Add at least one entry'),
  active: z.boolean(),
});

export type AboutTimelineSectionFormValues = z.infer<typeof aboutTimelineSectionSchema>;

export const aboutSectionCreateSchema = z.discriminatedUnion('format', [
  aboutTextSectionSchema.extend({ format: z.literal('text') }),
  aboutTimelineSectionSchema.extend({ format: z.literal('timeline') }),
]);

export type AboutSectionCreateFormValues = z.infer<typeof aboutSectionCreateSchema>;

export const aboutSectionSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200),
  content: z.string().trim().min(1, 'Content is required'),
  active: z.boolean(),
});

export type AboutSectionFormValues = z.infer<typeof aboutSectionSchema>;
