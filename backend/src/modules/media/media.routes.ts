import { Router } from 'express';

import { PERMISSIONS } from '../../constants/permissions.js';
import { uploadSingleImage } from '../../middlewares/upload.middleware.js';
import { requireAnyPermission } from '../../middlewares/role.middleware.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { validateParams, validateQuery } from '../../middlewares/validate.middleware.js';
import { mediaController } from './media.controller.js';
import { mediaIdParamSchema, uploadMediaQuerySchema } from './media.validator.js';

const mediaRouter = Router();

mediaRouter.post(
  '/upload',
  authenticate,
  requireAnyPermission(PERMISSIONS.MEDIA_WRITE, PERMISSIONS.PROJECTS_WRITE, PERMISSIONS.BLOG_WRITE),
  uploadSingleImage,
  validateQuery(uploadMediaQuerySchema),
  mediaController.upload
);

mediaRouter.delete(
  '/:id',
  authenticate,
  requireAnyPermission(PERMISSIONS.MEDIA_WRITE, PERMISSIONS.PROJECTS_WRITE),
  validateParams(mediaIdParamSchema),
  mediaController.delete
);

export { mediaRouter };
