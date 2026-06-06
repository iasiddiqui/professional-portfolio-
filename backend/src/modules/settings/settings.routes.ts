import { Router } from 'express';

import { PERMISSIONS } from '../../constants/permissions.js';
import { authorizeStrict } from '../../middlewares/role.middleware.js';
import { validateBody } from '../../middlewares/validate.middleware.js';
import { settingsController } from './settings.controller.js';
import { updateSettingsSchema } from './settings.validator.js';

const settingsRouter = Router();

settingsRouter.get('/', authorizeStrict(PERMISSIONS.SETTINGS_READ), settingsController.get);

settingsRouter.patch(
  '/',
  authorizeStrict(PERMISSIONS.SETTINGS_WRITE),
  validateBody(updateSettingsSchema),
  settingsController.update
);

export { settingsRouter };
