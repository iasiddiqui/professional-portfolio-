import type { Request, Response } from 'express';

import { HTTP_STATUS } from '../../constants/http-status.js';
import { asyncHandler } from '../../utils/async-handler.js';
import { buildPaginationMeta, sendPaginated, sendSuccess } from '../../utils/api-response.js';
import { AppError } from '../../utils/app-error.js';
import { getPublicUploadUrl } from '../../utils/upload.js';
import { getValidatedQuery } from '../../utils/validated-request.js';
import { resumeService } from './resume.service.js';
import type {
  CreateResumeInput,
  ResumeListQueryInput,
  UpdateResumeInput,
} from './resume.validator.js';

export class ResumeController {
  list = asyncHandler(async (req: Request, res: Response) => {
    const result = await resumeService.list(getValidatedQuery<ResumeListQueryInput>(req));
    sendPaginated(res, result.items, buildPaginationMeta(result.page, result.limit, result.total));
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const resume = await resumeService.getById(String(req.params.id));
    sendSuccess(res, resume);
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const resume = await resumeService.create(req.body as CreateResumeInput, req.user!.permissions);
    sendSuccess(res, resume, { status: HTTP_STATUS.CREATED, message: 'Resume created successfully' });
  });

  upload = asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      throw new AppError('No file uploaded', HTTP_STATUS.BAD_REQUEST);
    }

    sendSuccess(
      res,
      {
        url: getPublicUploadUrl(req.file.filename),
        filename: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
      },
      { status: HTTP_STATUS.CREATED, message: 'Resume file uploaded successfully' }
    );
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const resume = await resumeService.update(
      String(req.params.id),
      req.body as UpdateResumeInput,
      req.user!.permissions
    );
    sendSuccess(res, resume, { message: 'Resume updated successfully' });
  });

  activate = asyncHandler(async (req: Request, res: Response) => {
    const resume = await resumeService.activate(String(req.params.id), req.user!.permissions);
    sendSuccess(res, resume, { message: 'Resume activated successfully' });
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const result = await resumeService.delete(String(req.params.id), req.user!.permissions);
    sendSuccess(res, result, { message: 'Resume deleted successfully' });
  });
}

export const resumeController = new ResumeController();
