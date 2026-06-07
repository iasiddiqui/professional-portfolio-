import { z } from 'zod';

import { resolveResumeFileName } from '@/lib/file-url';

function isValidResumeFileUrl(value: string): boolean {
  if (value.startsWith('/uploads/')) return true;

  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/** Human-readable version stamp, e.g. "Jun 7, 2026, 2:30 PM". */
export function generateResumeVersion(date = new Date()): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export const resumeFormSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200),
  fileUrl: z
    .string()
    .trim()
    .min(1, 'Upload a resume or enter a file URL')
    .refine(isValidResumeFileUrl, 'Must be a valid URL or uploaded file'),
  fileName: z.string().trim().max(255).optional(),
  version: z.string().trim().min(1, 'Version is required').max(50),
  isActive: z.boolean(),
});

export type ResumeFormValues = z.infer<typeof resumeFormSchema>;

export function toResumePayload(values: ResumeFormValues) {
  return {
    title: values.title.trim(),
    fileUrl: values.fileUrl.trim(),
    fileName: resolveResumeFileName(values.fileName, values.fileUrl),
    version: values.version.trim(),
    isActive: values.isActive,
  };
}

export function toResumeFormValues(resume: {
  title: string;
  fileUrl: string;
  fileName?: string;
  version: string;
  isActive: boolean;
}): ResumeFormValues {
  return {
    title: resume.title,
    fileUrl: resume.fileUrl,
    fileName: resolveResumeFileName(resume.fileName, resume.fileUrl),
    version: resume.version,
    isActive: resume.isActive,
  };
}

export function createResumeFormDefaultValues(): ResumeFormValues {
  return {
    title: '',
    fileUrl: '',
    fileName: '',
    version: generateResumeVersion(),
    isActive: false,
  };
}

export const resumeFormDefaultValues: ResumeFormValues = createResumeFormDefaultValues();
