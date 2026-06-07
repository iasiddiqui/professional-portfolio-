import type { Request, Response } from 'express';

import { asyncHandler } from '../../utils/async-handler.js';
import { sendSuccess } from '../../utils/api-response.js';
import { getValidatedQuery } from '../../utils/validated-request.js';
import { analyticsService } from './analytics.service.js';
import type { AnalyticsOverviewQueryInput, RecordVisitInput } from './analytics.validator.js';

export class AnalyticsController {
  getPublicStats = asyncHandler(async (_req: Request, res: Response) => {
    const stats = await analyticsService.getPublicStats();
    sendSuccess(res, stats);
  });

  recordVisit = asyncHandler(async (req: Request, res: Response) => {
    const result = await analyticsService.recordVisit(req.body as RecordVisitInput, req, res);
    sendSuccess(res, result);
  });

  overview = asyncHandler(async (req: Request, res: Response) => {
    const overview = await analyticsService.getOverview(
      getValidatedQuery<AnalyticsOverviewQueryInput>(req)
    );
    sendSuccess(res, overview);
  });
}

export const analyticsController = new AnalyticsController();
