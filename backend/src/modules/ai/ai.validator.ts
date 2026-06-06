import { z } from 'zod';

import { paginationQuerySchema } from '../../validators/pagination.validator.js';

export const askIshanSchema = z.object({
  message: z.string().trim().min(1).max(2000),
  sessionId: z.string().trim().min(8).max(64).optional(),
});

export const aiListQuerySchema = paginationQuerySchema.extend({
  feature: z.enum(['ASK_ISHAN', 'PROJECT_ESTIMATOR']).optional(),
});

export type AskIshanInput = z.infer<typeof askIshanSchema>;
export type AiListQueryInput = z.infer<typeof aiListQuerySchema>;
