import { Router } from 'express';

import { PERMISSIONS } from '../../constants/permissions.js';
import { authorizeStrict } from '../../middlewares/role.middleware.js';
import { validateBody, validateParams, validateQuery } from '../../middlewares/validate.middleware.js';
import { testimonialsController } from './testimonials.controller.js';
import {
  createTestimonialSchema,
  testimonialIdParamSchema,
  testimonialListQuerySchema,
  updateTestimonialSchema,
} from './testimonials.validator.js';

const testimonialsRouter = Router();

testimonialsRouter.get(
  '/',
  authorizeStrict(PERMISSIONS.TESTIMONIALS_READ),
  validateQuery(testimonialListQuerySchema),
  testimonialsController.list
);

testimonialsRouter.get(
  '/:id',
  authorizeStrict(PERMISSIONS.TESTIMONIALS_READ),
  validateParams(testimonialIdParamSchema),
  testimonialsController.getById
);

testimonialsRouter.post(
  '/',
  authorizeStrict(PERMISSIONS.TESTIMONIALS_WRITE),
  validateBody(createTestimonialSchema),
  testimonialsController.create
);

testimonialsRouter.patch(
  '/:id',
  authorizeStrict(PERMISSIONS.TESTIMONIALS_WRITE),
  validateParams(testimonialIdParamSchema),
  validateBody(updateTestimonialSchema),
  testimonialsController.update
);

testimonialsRouter.delete(
  '/:id',
  authorizeStrict(PERMISSIONS.TESTIMONIALS_WRITE),
  validateParams(testimonialIdParamSchema),
  testimonialsController.delete
);

export { testimonialsRouter };
