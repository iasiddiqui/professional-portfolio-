import { Router } from 'express';

import { env } from '../config/env.js';
import { v1Router } from './v1/index.js';

const router = Router();

router.use(env.API_PREFIX, v1Router);

export { router as apiRouter };
