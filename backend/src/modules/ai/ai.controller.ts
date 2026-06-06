import type { Request, Response } from 'express';
import { AiFeatureType } from '@prisma/client';

import { PERMISSIONS } from '../../constants/permissions.js';
import { asyncHandler } from '../../utils/async-handler.js';
import { buildPaginationMeta, sendPaginated, sendSuccess } from '../../utils/api-response.js';
import { mapAiInteractionToDto } from './ai.dto.js';
import { aiService } from './ai.service.js';
import type { AiListQueryInput, AskIshanInput } from './ai.validator.js';
import { HTTP_STATUS } from '../../constants/http-status.js';

export class AiController {
  askIshan = asyncHandler(async (req: Request, res: Response) => {
    const result = await aiService.askIshan(req.body as AskIshanInput, req);
    sendSuccess(res, result, { status: HTTP_STATUS.CREATED });
  });

  listInteractions = asyncHandler(async (req: Request, res: Response) => {
    const query = req.query as unknown as AiListQueryInput;
    const page = query.page;
    const limit = query.limit;
    const skip = (page - 1) * limit;

    const result = await aiService.listInteractions({
      page,
      limit,
      skip,
      feature: query.feature as AiFeatureType | undefined,
    });

    sendPaginated(
      res,
      result.items.map(mapAiInteractionToDto),
      buildPaginationMeta(page, limit, result.total)
    );
  });
}

export const aiController = new AiController();
export const aiReadGuards = [PERMISSIONS.ANALYTICS_READ] as const;
