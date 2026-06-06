import type { Request, Response } from 'express';

import { HTTP_STATUS } from '../../constants/http-status.js';
import { asyncHandler } from '../../utils/async-handler.js';
import { sendSuccess } from '../../utils/api-response.js';
import { blogCategoriesService } from './blog-categories.service.js';
import type {
  CreateBlogCategoryInput,
  UpdateBlogCategoryInput,
} from './blog-categories.validator.js';

export class BlogCategoriesController {
  list = asyncHandler(async (_req: Request, res: Response) => {
    const categories = await blogCategoriesService.list();
    sendSuccess(res, categories);
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const category = await blogCategoriesService.create(
      req.body as CreateBlogCategoryInput,
      req.user!.permissions
    );
    sendSuccess(res, category, { status: HTTP_STATUS.CREATED, message: 'Category created successfully' });
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const category = await blogCategoriesService.update(
      String(req.params.id),
      req.body as UpdateBlogCategoryInput,
      req.user!.permissions
    );
    sendSuccess(res, category, { message: 'Category updated successfully' });
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const result = await blogCategoriesService.delete(String(req.params.id), req.user!.permissions);
    sendSuccess(res, result, { message: 'Category deleted successfully' });
  });
}

export const blogCategoriesController = new BlogCategoriesController();
