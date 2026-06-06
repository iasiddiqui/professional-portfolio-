import { z } from 'zod';

export const resumeFormSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200),
  fileUrl: z.string().trim().url('Must be a valid URL'),
  version: z.string().trim().min(1, 'Version is required').max(50),
  isActive: z.boolean(),
});

export type ResumeFormValues = z.infer<typeof resumeFormSchema>;

export function toResumePayload(values: ResumeFormValues) {
  return {
    title: values.title,
    fileUrl: values.fileUrl,
    version: values.version,
    isActive: values.isActive,
  };
}

export function toResumeFormValues(resume: {
  title: string;
  fileUrl: string;
  version: string;
  isActive: boolean;
}): ResumeFormValues {
  return {
    title: resume.title,
    fileUrl: resume.fileUrl,
    version: resume.version,
    isActive: resume.isActive,
  };
}

export const resumeFormDefaultValues: ResumeFormValues = {
  title: '',
  fileUrl: '',
  version: '',
  isActive: false,
};
