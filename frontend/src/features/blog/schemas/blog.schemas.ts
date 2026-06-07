import { z } from 'zod';

export const contentFormatSchema = z.enum(['MDX', 'MARKDOWN', 'HTML']);

function hasMeaningfulContent(content: string, format: z.infer<typeof contentFormatSchema>): boolean {
  const trimmed = content.trim();
  if (!trimmed) return false;

  if (format === 'HTML') {
    const text = trimmed
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    return text.length > 0;
  }

  return true;
}

export const blogFormSchema = z
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
    excerpt: z.string().trim().min(1, 'Excerpt is required').max(500),
    content: z.string().trim().min(1, 'Content is required'),
    contentFormat: contentFormatSchema,
    featuredImage: z.string().nullable(),
    published: z.boolean(),
    seoTitle: z.string().trim(),
    seoDescription: z.string().trim(),
    categoryId: z.string(),
    tagIds: z.array(z.string()),
  })
  .superRefine((values, ctx) => {
    if (!hasMeaningfulContent(values.content, values.contentFormat)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Content is required',
        path: ['content'],
      });
    }

    if (values.seoTitle && values.seoTitle.length > 70) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Max 70 characters', path: ['seoTitle'] });
    }
    if (values.seoDescription && values.seoDescription.length > 160) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Max 160 characters', path: ['seoDescription'] });
    }
  });

export type BlogFormValues = z.infer<typeof blogFormSchema>;

export const blogCategoryFormSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  slug: z
    .string()
    .trim()
    .optional()
    .refine(
      (value) => !value || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value),
      'Slug must be lowercase with hyphens only'
    ),
  description: z.string().trim(),
});

export type BlogCategoryFormValues = z.infer<typeof blogCategoryFormSchema>;

export const tagFormSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  slug: z
    .string()
    .trim()
    .optional()
    .refine(
      (value) => !value || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value),
      'Slug must be lowercase with hyphens only'
    ),
});

export type TagFormValues = z.infer<typeof tagFormSchema>;

export function toBlogPayload(values: BlogFormValues) {
  const featuredImage = values.featuredImage?.trim() ? values.featuredImage.trim() : null;

  return {
    title: values.title.trim(),
    slug: values.slug?.trim() || undefined,
    excerpt: values.excerpt.trim(),
    content: values.content,
    contentFormat: values.contentFormat,
    featuredImage,
    published: values.published,
    seoTitle: values.seoTitle.trim() || null,
    seoDescription: values.seoDescription.trim() || null,
    categoryId: values.categoryId === '__none__' || !values.categoryId ? null : values.categoryId,
    tagIds: values.tagIds,
  };
}

export function toBlogFormValues(post: {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  contentFormat: z.infer<typeof contentFormatSchema>;
  featuredImage: string | null;
  published: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  categoryId: string | null;
  tags: { id: string }[];
}): BlogFormValues {
  return {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    contentFormat: post.contentFormat,
    featuredImage: post.featuredImage,
    published: post.published,
    seoTitle: post.seoTitle ?? '',
    seoDescription: post.seoDescription ?? '',
    categoryId: post.categoryId ?? '__none__',
    tagIds: post.tags.map((tag) => tag.id),
  };
}

export const blogFormDefaultValues: BlogFormValues = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  contentFormat: 'MDX',
  featuredImage: null,
  published: false,
  seoTitle: '',
  seoDescription: '',
  categoryId: '__none__',
  tagIds: [],
};

export const blogCategoryFormDefaultValues: BlogCategoryFormValues = {
  name: '',
  slug: '',
  description: '',
};

export const tagFormDefaultValues: TagFormValues = {
  name: '',
  slug: '',
};
