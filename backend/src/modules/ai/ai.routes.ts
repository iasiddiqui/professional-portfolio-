import { Router } from 'express';

import { aiRateLimiter } from '../../middlewares/rate-limit.middleware.js';
import { authorizeStrict } from '../../middlewares/role.middleware.js';
import { validateBody, validateQuery } from '../../middlewares/validate.middleware.js';
import { aiController, aiReadGuards } from './ai.controller.js';
import { askIshanSchema, aiListQuerySchema } from './ai.validator.js';

const aiPublicRouter = Router();

aiPublicRouter.use(aiRateLimiter);

aiPublicRouter.post('/ask', validateBody(askIshanSchema), aiController.askIshan);

const aiAdminRouter = Router();

aiAdminRouter.get(
  '/interactions',
  authorizeStrict(...aiReadGuards),
  validateQuery(aiListQuerySchema),
  aiController.listInteractions
);

export { aiPublicRouter, aiAdminRouter };
