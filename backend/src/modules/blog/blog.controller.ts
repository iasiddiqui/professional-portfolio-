import type { Request, Response } from 'express';

import { HTTP_STATUS } from '../../constants/http-status.js';
import { asyncHandler } from '../../utils/async-handler.js';
import { buildPaginationMeta, sendPaginated, sendSuccess } from '../../utils/api-response.js';
import { blogService } from './blog.service.js';
import type {
  BlogListQueryInput,
  CreateBlogPostInput,
  PublishBlogPostInput,
  UpdateBlogPostInput,
} from './blog.validator.js';

export class BlogController {
  list = asyncHandler(async (req: Request, res: Response) => {
    const result = await blogService.list(req.query as unknown as BlogListQueryInput);
    sendPaginated(res, result.items, buildPaginationMeta(result.page, result.limit, result.total));
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const post = await blogService.getById(String(req.params.id));
    sendSuccess(res, post);
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const post = await blogService.create(
      req.body as CreateBlogPostInput,
      req.user!.id,
      req.user!.permissions
    );
    sendSuccess(res, post, { status: HTTP_STATUS.CREATED, message: 'Blog post created successfully' });
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const post = await blogService.update(
      String(req.params.id),
      req.body as UpdateBlogPostInput,
      req.user!.permissions
    );
    sendSuccess(res, post, { message: 'Blog post updated successfully' });
  });

  publish = asyncHandler(async (req: Request, res: Response) => {
    const post = await blogService.publish(
      String(req.params.id),
      req.body as PublishBlogPostInput,
      req.user!.permissions
    );
    sendSuccess(res, post, { message: 'Blog post publish status updated' });
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const result = await blogService.delete(String(req.params.id), req.user!.permissions);
    sendSuccess(res, result, { message: 'Blog post deleted successfully' });
  });
}

export const blogController = new BlogController();
