import type { Request, Response } from 'express';

import { HTTP_STATUS } from '../../constants/http-status.js';
import { asyncHandler } from '../../utils/async-handler.js';
import { sendSuccess } from '../../utils/api-response.js';
import { tagsService } from './tags.service.js';
import type { CreateTagInput, UpdateTagInput } from './tags.validator.js';

export class TagsController {
  list = asyncHandler(async (_req: Request, res: Response) => {
    const tags = await tagsService.list();
    sendSuccess(res, tags);
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const tag = await tagsService.create(req.body as CreateTagInput, req.user!.permissions);
    sendSuccess(res, tag, { status: HTTP_STATUS.CREATED, message: 'Tag created successfully' });
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const tag = await tagsService.update(
      String(req.params.id),
      req.body as UpdateTagInput,
      req.user!.permissions
    );
    sendSuccess(res, tag, { message: 'Tag updated successfully' });
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const result = await tagsService.delete(String(req.params.id), req.user!.permissions);
    sendSuccess(res, result, { message: 'Tag deleted successfully' });
  });
}

export const tagsController = new TagsController();
