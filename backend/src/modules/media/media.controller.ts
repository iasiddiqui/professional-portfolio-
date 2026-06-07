import type { Request, Response } from 'express';

import { HTTP_STATUS } from '../../constants/http-status.js';
import { asyncHandler } from '../../utils/async-handler.js';
import { sendSuccess } from '../../utils/api-response.js';
import { AppError } from '../../utils/app-error.js';
import { getValidatedQuery } from '../../utils/validated-request.js';
import { mediaService } from './media.service.js';
import type { UploadMediaQueryInput } from './media.validator.js';

export class MediaController {
  upload = asyncHandler(async (req: Request, res: Response) => {
    if (!req.file?.buffer) {
      throw new AppError('No file uploaded', HTTP_STATUS.BAD_REQUEST);
    }

    const media = await mediaService.upload(
      {
        buffer: req.file.buffer,
        mimetype: req.file.mimetype,
        size: req.file.size,
        originalname: req.file.originalname,
      },
      getValidatedQuery<UploadMediaQueryInput>(req)
    );

    sendSuccess(res, media, { status: HTTP_STATUS.CREATED, message: 'File uploaded successfully' });
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const result = await mediaService.delete(String(req.params.id));
    sendSuccess(res, result, { message: 'Media deleted successfully' });
  });
}

export const mediaController = new MediaController();
