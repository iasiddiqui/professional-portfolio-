import { Router } from 'express';

import { PERMISSIONS } from '../../constants/permissions.js';
import { authorizeStrict } from '../../middlewares/role.middleware.js';
import { validateBody, validateParams } from '../../middlewares/validate.middleware.js';
import { blogCategoriesController } from './blog-categories.controller.js';
import {
  blogCategoryIdParamSchema,
  createBlogCategorySchema,
  updateBlogCategorySchema,
} from './blog-categories.validator.js';

const blogCategoriesRouter = Router();

blogCategoriesRouter.get(
  '/',
  authorizeStrict(PERMISSIONS.BLOG_READ),
  blogCategoriesController.list
);

blogCategoriesRouter.post(
  '/',
  authorizeStrict(PERMISSIONS.BLOG_WRITE),
  validateBody(createBlogCategorySchema),
  blogCategoriesController.create
);

blogCategoriesRouter.patch(
  '/:id',
  authorizeStrict(PERMISSIONS.BLOG_WRITE),
  validateParams(blogCategoryIdParamSchema),
  validateBody(updateBlogCategorySchema),
  blogCategoriesController.update
);

blogCategoriesRouter.delete(
  '/:id',
  authorizeStrict(PERMISSIONS.BLOG_DELETE),
  validateParams(blogCategoryIdParamSchema),
  blogCategoriesController.delete
);

export { blogCategoriesRouter };
