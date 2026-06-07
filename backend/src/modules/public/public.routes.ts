import { Router } from 'express';

import { validateBody, validateParams, validateQuery } from '../../middlewares/validate.middleware.js';
import { analyticsController } from '../analytics/analytics.controller.js';
import { recordVisitSchema } from '../analytics/analytics.validator.js';
import { contactRateLimiter } from '../../middlewares/rate-limit.middleware.js';
import { publicController } from './public.controller.js';
import {
  publicContactSchema,
  publicConsultationSchema,
  publicHireMeSchema,
  publicListQuerySchema,
  publicSlugParamSchema,
} from './public.validator.js';

const publicRouter = Router();

publicRouter.get('/site', publicController.getSite);
publicRouter.get('/about', publicController.getAbout);
publicRouter.get('/analytics/stats', analyticsController.getPublicStats);
publicRouter.post(
  '/analytics/visit',
  validateBody(recordVisitSchema),
  analyticsController.recordVisit
);
publicRouter.get('/services', publicController.getServices);
publicRouter.get('/testimonials', publicController.getTestimonials);
publicRouter.get('/resume', publicController.getResume);

publicRouter.get('/projects', validateQuery(publicListQuerySchema), publicController.listProjects);
publicRouter.get(
  '/projects/:slug',
  validateParams(publicSlugParamSchema),
  publicController.getProject
);

publicRouter.get('/blog', validateQuery(publicListQuerySchema), publicController.listBlogPosts);
publicRouter.get('/blog/:slug', validateParams(publicSlugParamSchema), publicController.getBlogPost);

publicRouter.post(
  '/contact',
  contactRateLimiter,
  validateBody(publicContactSchema),
  publicController.submitContact
);

publicRouter.post(
  '/hire-me',
  contactRateLimiter,
  validateBody(publicHireMeSchema),
  publicController.submitHireMe
);

publicRouter.post(
  '/consultation',
  contactRateLimiter,
  validateBody(publicConsultationSchema),
  publicController.submitConsultation
);

export { publicRouter };
