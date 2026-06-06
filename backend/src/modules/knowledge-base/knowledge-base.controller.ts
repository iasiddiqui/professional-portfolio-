import type { Request, Response } from 'express';

import { HTTP_STATUS } from '../../constants/http-status.js';
import { asyncHandler } from '../../utils/async-handler.js';
import { buildPaginationMeta, sendPaginated, sendSuccess } from '../../utils/api-response.js';
import { getValidatedQuery } from '../../utils/validated-request.js';
import { knowledgeBaseService } from './knowledge-base.service.js';
import type {
  CreateKnowledgeBaseInput,
  KnowledgeBaseListQueryInput,
  UpdateKnowledgeBaseInput,
} from './knowledge-base.validator.js';

export class KnowledgeBaseController {
  list = asyncHandler(async (req: Request, res: Response) => {
    const result = await knowledgeBaseService.list(getValidatedQuery<KnowledgeBaseListQueryInput>(req));
    sendPaginated(res, result.items, buildPaginationMeta(result.page, result.limit, result.total));
  });

  getCategories = asyncHandler(async (_req: Request, res: Response) => {
    const categories = await knowledgeBaseService.getCategories();
    sendSuccess(res, categories);
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const entry = await knowledgeBaseService.getById(String(req.params.id));
    sendSuccess(res, entry);
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const entry = await knowledgeBaseService.create(
      req.body as CreateKnowledgeBaseInput,
      req.user!.permissions
    );
    sendSuccess(res, entry, {
      status: HTTP_STATUS.CREATED,
      message: 'Knowledge base entry created successfully',
    });
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const entry = await knowledgeBaseService.update(
      String(req.params.id),
      req.body as UpdateKnowledgeBaseInput,
      req.user!.permissions
    );
    sendSuccess(res, entry, { message: 'Knowledge base entry updated successfully' });
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const result = await knowledgeBaseService.delete(String(req.params.id), req.user!.permissions);
    sendSuccess(res, result, { message: 'Knowledge base entry deleted successfully' });
  });
}

export const knowledgeBaseController = new KnowledgeBaseController();
