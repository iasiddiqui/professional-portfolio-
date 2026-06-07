import { z } from 'zod';

export const recordVisitSchema = z.object({
  path: z.string().trim().max(500).optional(),
  referrer: z.string().trim().max(2000).optional(),
});

export const analyticsOverviewQuerySchema = z.object({
  range: z.enum(['7d', '30d', '90d', 'all']).optional().default('30d'),
});

export type RecordVisitInput = z.infer<typeof recordVisitSchema>;
export type AnalyticsOverviewQueryInput = z.infer<typeof analyticsOverviewQuerySchema>;
