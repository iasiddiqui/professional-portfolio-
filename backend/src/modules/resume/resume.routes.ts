import { Router } from 'express';

import { PERMISSIONS } from '../../constants/permissions.js';
import { authorizeStrict } from '../../middlewares/role.middleware.js';
import { uploadSingleDocument } from '../../middlewares/upload.middleware.js';
import { validateBody, validateParams, validateQuery } from '../../middlewares/validate.middleware.js';
import { resumeController } from './resume.controller.js';
import {
  createResumeSchema,
  resumeIdParamSchema,
  resumeListQuerySchema,
  updateResumeSchema,
} from './resume.validator.js';

const resumeRouter = Router();

resumeRouter.get(
  '/',
  authorizeStrict(PERMISSIONS.RESUME_READ),
  validateQuery(resumeListQuerySchema),
  resumeController.list
);

resumeRouter.post(
  '/upload',
  authorizeStrict(PERMISSIONS.RESUME_WRITE),
  uploadSingleDocument,
  resumeController.upload
);

resumeRouter.get(
  '/:id',
  authorizeStrict(PERMISSIONS.RESUME_READ),
  validateParams(resumeIdParamSchema),
  resumeController.getById
);

resumeRouter.post(
  '/',
  authorizeStrict(PERMISSIONS.RESUME_WRITE),
  validateBody(createResumeSchema),
  resumeController.create
);

resumeRouter.patch(
  '/:id/activate',
  authorizeStrict(PERMISSIONS.RESUME_WRITE),
  validateParams(resumeIdParamSchema),
  resumeController.activate
);

resumeRouter.patch(
  '/:id',
  authorizeStrict(PERMISSIONS.RESUME_WRITE),
  validateParams(resumeIdParamSchema),
  validateBody(updateResumeSchema),
  resumeController.update
);

resumeRouter.delete(
  '/:id',
  authorizeStrict(PERMISSIONS.RESUME_WRITE),
  validateParams(resumeIdParamSchema),
  resumeController.delete
);

export { resumeRouter };
