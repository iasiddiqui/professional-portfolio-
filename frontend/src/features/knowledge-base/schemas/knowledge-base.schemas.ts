import { z } from 'zod';

export const knowledgeBaseFormSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200),
  content: z.string().trim().min(1, 'Content is required'),
  category: z.string().trim().min(1, 'Category is required').max(100),
  active: z.boolean(),
});

export type KnowledgeBaseFormValues = z.infer<typeof knowledgeBaseFormSchema>;

export function toKnowledgeBasePayload(values: KnowledgeBaseFormValues) {
  return {
    title: values.title,
    content: values.content,
    category: values.category,
    active: values.active,
  };
}

export function toKnowledgeBaseFormValues(entry: {
  title: string;
  content: string;
  category: string;
  active: boolean;
}): KnowledgeBaseFormValues {
  return {
    title: entry.title,
    content: entry.content,
    category: entry.category,
    active: entry.active,
  };
}

export const knowledgeBaseFormDefaultValues: KnowledgeBaseFormValues = {
  title: '',
  content: '',
  category: '',
  active: true,
};
