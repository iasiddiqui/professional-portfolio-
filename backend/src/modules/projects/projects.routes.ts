import { Router } from 'express';

import { PERMISSIONS } from '../../constants/permissions.js';
import { authorizeStrict } from '../../middlewares/role.middleware.js';
import { validateBody, validateParams, validateQuery } from '../../middlewares/validate.middleware.js';
import { projectsController } from './projects.controller.js';
import {
  createProjectSchema,
  projectIdParamSchema,
  projectListQuerySchema,
  updateProjectSchema,
  updateProjectStatusSchema,
} from './projects.validator.js';

const projectsRouter = Router();

projectsRouter.get(
  '/',
  authorizeStrict(PERMISSIONS.PROJECTS_READ),
  validateQuery(projectListQuerySchema),
  projectsController.list
);

projectsRouter.get(
  '/:id',
  authorizeStrict(PERMISSIONS.PROJECTS_READ),
  validateParams(projectIdParamSchema),
  projectsController.getById
);

projectsRouter.post(
  '/',
  authorizeStrict(PERMISSIONS.PROJECTS_WRITE),
  validateBody(createProjectSchema),
  projectsController.create
);

projectsRouter.patch(
  '/:id',
  authorizeStrict(PERMISSIONS.PROJECTS_WRITE),
  validateParams(projectIdParamSchema),
  validateBody(updateProjectSchema),
  projectsController.update
);

projectsRouter.patch(
  '/:id/status',
  authorizeStrict(PERMISSIONS.PROJECTS_WRITE),
  validateParams(projectIdParamSchema),
  validateBody(updateProjectStatusSchema),
  projectsController.updateStatus
);

projectsRouter.delete(
  '/:id',
  authorizeStrict(PERMISSIONS.PROJECTS_DELETE),
  validateParams(projectIdParamSchema),
  projectsController.delete
);

export { projectsRouter };
