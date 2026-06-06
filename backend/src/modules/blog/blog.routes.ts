import { Router } from 'express';

import { PERMISSIONS } from '../../constants/permissions.js';
import { authorizeStrict } from '../../middlewares/role.middleware.js';
import { validateBody, validateParams, validateQuery } from '../../middlewares/validate.middleware.js';
import { blogController } from './blog.controller.js';
import {
  blogIdParamSchema,
  blogListQuerySchema,
  createBlogPostSchema,
  publishBlogPostSchema,
  updateBlogPostSchema,
} from './blog.validator.js';

const blogRouter = Router();

blogRouter.get(
  '/',
  authorizeStrict(PERMISSIONS.BLOG_READ),
  validateQuery(blogListQuerySchema),
  blogController.list
);

blogRouter.get(
  '/:id',
  authorizeStrict(PERMISSIONS.BLOG_READ),
  validateParams(blogIdParamSchema),
  blogController.getById
);

blogRouter.post(
  '/',
  authorizeStrict(PERMISSIONS.BLOG_WRITE),
  validateBody(createBlogPostSchema),
  blogController.create
);

blogRouter.patch(
  '/:id',
  authorizeStrict(PERMISSIONS.BLOG_WRITE),
  validateParams(blogIdParamSchema),
  validateBody(updateBlogPostSchema),
  blogController.update
);

blogRouter.patch(
  '/:id/publish',
  authorizeStrict(PERMISSIONS.BLOG_WRITE),
  validateParams(blogIdParamSchema),
  validateBody(publishBlogPostSchema),
  blogController.publish
);

blogRouter.delete(
  '/:id',
  authorizeStrict(PERMISSIONS.BLOG_DELETE),
  validateParams(blogIdParamSchema),
  blogController.delete
);

export { blogRouter };
