import { Router } from 'express';

import { authenticate } from '../../middlewares/auth.middleware.js';
import { requirePublicRegistration } from '../../middlewares/registration.middleware.js';
import { authRateLimiter } from '../../middlewares/rate-limit.middleware.js';
import { validateBody } from '../../middlewares/validate.middleware.js';
import { authController } from './auth.controller.js';
import {
  changePasswordSchema,
  loginSchema,
  registerSchema,
} from './auth.validator.js';

const authRouter = Router();

authRouter.use(authRateLimiter);

authRouter.post(
  '/register',
  requirePublicRegistration,
  validateBody(registerSchema),
  authController.register
);
authRouter.post('/login', validateBody(loginSchema), authController.login);
authRouter.post('/refresh-token', authController.refreshToken);
authRouter.post('/logout', authenticate, authController.logout);
authRouter.post('/logout-all', authenticate, authController.logoutAllSessions);
authRouter.get('/me', authenticate, authController.getMe);
authRouter.patch(
  '/change-password',
  authenticate,
  validateBody(changePasswordSchema),
  authController.changePassword
);

export { authRouter };
