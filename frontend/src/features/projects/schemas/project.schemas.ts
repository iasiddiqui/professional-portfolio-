import { z } from 'zod';

export const projectStatusSchema = z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']);

export const projectFormSchema = z
  .object({
    title: z.string().trim().min(1, 'Title is required').max(200),
    slug: z
      .string()
      .trim()
      .optional()
      .refine(
        (value) => !value || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value),
        'Slug must be lowercase with hyphens only'
      ),
    shortDescription: z.string().trim().min(1, 'Short description is required').max(500),
    description: z.string().trim().min(1, 'Description is required'),
    techStackInput: z.string().trim().min(1, 'Add at least one technology'),
    architecture: z.string().trim().min(1, 'Architecture is required'),
    githubUrl: z.string().trim(),
    liveUrl: z.string().trim(),
    featured: z.boolean(),
    status: projectStatusSchema,
    thumbnailMediaId: z.string().nullable().optional(),
    galleryMediaIds: z.array(z.string()),
    removeMediaIds: z.array(z.string()),
  })
  .superRefine((values, ctx) => {
    if (values.githubUrl && !z.string().url().safeParse(values.githubUrl).success) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Must be a valid URL', path: ['githubUrl'] });
    }
    if (values.liveUrl && !z.string().url().safeParse(values.liveUrl).success) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Must be a valid URL', path: ['liveUrl'] });
    }
  });

export type ProjectFormValues = z.infer<typeof projectFormSchema>;

export function parseTechStack(input: string): string[] {
  return input
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function formatTechStack(values: string[]): string {
  return values.join(', ');
}

export function toProjectPayload(values: ProjectFormValues) {
  return {
    title: values.title,
    slug: values.slug || undefined,
    shortDescription: values.shortDescription,
    description: values.description,
    techStack: parseTechStack(values.techStackInput),
    architecture: values.architecture,
    githubUrl: values.githubUrl || null,
    liveUrl: values.liveUrl || null,
    featured: values.featured,
    status: values.status,
    thumbnailMediaId: values.thumbnailMediaId ?? null,
    galleryMediaIds: values.galleryMediaIds,
    removeMediaIds: values.removeMediaIds,
  };
}

export function toProjectFormValues(project: {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  techStack: string[];
  architecture: string;
  githubUrl: string | null;
  liveUrl: string | null;
  featured: boolean;
  status: z.infer<typeof projectStatusSchema>;
  thumbnail: { id: string } | null;
  gallery: { id: string }[];
}): ProjectFormValues {
  return {
    title: project.title,
    slug: project.slug,
    shortDescription: project.shortDescription,
    description: project.description,
    techStackInput: formatTechStack(project.techStack),
    architecture: project.architecture,
    githubUrl: project.githubUrl ?? '',
    liveUrl: project.liveUrl ?? '',
    featured: project.featured,
    status: project.status,
    thumbnailMediaId: project.thumbnail?.id ?? null,
    galleryMediaIds: project.gallery.map((item) => item.id),
    removeMediaIds: [],
  };
}

export const projectFormDefaultValues: ProjectFormValues = {
  title: '',
  slug: '',
  shortDescription: '',
  description: '',
  techStackInput: '',
  architecture: '',
  githubUrl: '',
  liveUrl: '',
  featured: false,
  status: 'DRAFT',
  thumbnailMediaId: null,
  galleryMediaIds: [],
  removeMediaIds: [],
};
