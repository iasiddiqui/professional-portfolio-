import { Router } from 'express';

import { PERMISSIONS } from '../../constants/permissions.js';
import { authorizeStrict } from '../../middlewares/role.middleware.js';
import { validateBody, validateParams } from '../../middlewares/validate.middleware.js';
import { tagsController } from './tags.controller.js';
import { createTagSchema, tagIdParamSchema, updateTagSchema } from './tags.validator.js';

const tagsRouter = Router();

tagsRouter.get('/', authorizeStrict(PERMISSIONS.BLOG_READ), tagsController.list);

tagsRouter.post(
  '/',
  authorizeStrict(PERMISSIONS.BLOG_WRITE),
  validateBody(createTagSchema),
  tagsController.create
);

tagsRouter.patch(
  '/:id',
  authorizeStrict(PERMISSIONS.BLOG_WRITE),
  validateParams(tagIdParamSchema),
  validateBody(updateTagSchema),
  tagsController.update
);

tagsRouter.delete(
  '/:id',
  authorizeStrict(PERMISSIONS.BLOG_DELETE),
  validateParams(tagIdParamSchema),
  tagsController.delete
);

export { tagsRouter };
