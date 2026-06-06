import type { Request, Response } from 'express';

import { HTTP_STATUS } from '../../constants/http-status.js';
import { asyncHandler } from '../../utils/async-handler.js';
import { buildPaginationMeta, sendPaginated, sendSuccess } from '../../utils/api-response.js';
import { testimonialsService } from './testimonials.service.js';
import type {
  CreateTestimonialInput,
  TestimonialListQueryInput,
  UpdateTestimonialInput,
} from './testimonials.validator.js';

export class TestimonialsController {
  list = asyncHandler(async (req: Request, res: Response) => {
    const result = await testimonialsService.list(req.query as unknown as TestimonialListQueryInput);
    sendPaginated(res, result.items, buildPaginationMeta(result.page, result.limit, result.total));
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const testimonial = await testimonialsService.getById(String(req.params.id));
    sendSuccess(res, testimonial);
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const testimonial = await testimonialsService.create(
      req.body as CreateTestimonialInput,
      req.user!.permissions
    );
    sendSuccess(res, testimonial, {
      status: HTTP_STATUS.CREATED,
      message: 'Testimonial created successfully',
    });
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const testimonial = await testimonialsService.update(
      String(req.params.id),
      req.body as UpdateTestimonialInput,
      req.user!.permissions
    );
    sendSuccess(res, testimonial, { message: 'Testimonial updated successfully' });
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const result = await testimonialsService.delete(String(req.params.id), req.user!.permissions);
    sendSuccess(res, result, { message: 'Testimonial deleted successfully' });
  });
}

export const testimonialsController = new TestimonialsController();
