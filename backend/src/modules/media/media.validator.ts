import { z } from 'zod';

export const uploadMediaQuerySchema = z.object({
  projectId: z.string().cuid().optional(),
  alt: z.string().trim().max(200).optional(),
  isThumbnail: z
    .union([z.literal('true'), z.literal('false')])
    .optional()
    .transform((value) => value === 'true'),
});

export const mediaIdParamSchema = z.object({
  id: z.string().cuid(),
});

export type UploadMediaQueryInput = z.infer<typeof uploadMediaQuerySchema>;
