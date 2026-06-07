import { Router } from 'express';

import { PERMISSIONS } from '../../constants/permissions.js';
import { authorizeStrict } from '../../middlewares/role.middleware.js';
import { validateQuery } from '../../middlewares/validate.middleware.js';
import { analyticsController } from './analytics.controller.js';
import { analyticsOverviewQuerySchema } from './analytics.validator.js';

const analyticsRouter = Router();

analyticsRouter.get(
  '/overview',
  authorizeStrict(PERMISSIONS.ANALYTICS_READ),
  validateQuery(analyticsOverviewQuerySchema),
  analyticsController.overview
);

export { analyticsRouter };
