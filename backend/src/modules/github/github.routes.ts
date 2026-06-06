import { Router } from 'express';

import { githubRateLimiter } from '../../middlewares/rate-limit.middleware.js';
import { githubController } from './github.controller.js';

const githubPublicRouter = Router();

githubPublicRouter.use(githubRateLimiter);

githubPublicRouter.get('/', githubController.getOverview);
githubPublicRouter.get('/stats', githubController.getStats);
githubPublicRouter.get('/repos', githubController.getRepositories);
githubPublicRouter.get('/languages', githubController.getLanguages);
githubPublicRouter.get('/contributions', githubController.getContributions);

export { githubPublicRouter };
