import { Router } from 'express';

import { PERMISSIONS } from '../../constants/permissions.js';
import { authorizeStrict } from '../../middlewares/role.middleware.js';
import { validateBody, validateParams, validateQuery } from '../../middlewares/validate.middleware.js';
import { leadsController } from './leads.controller.js';
import {
  createLeadNoteSchema,
  createLeadSchema,
  leadIdParamSchema,
  leadListQuerySchema,
  leadNoteIdParamSchema,
  leadPipelineQuerySchema,
  updateLeadSchema,
  updateLeadStatusSchema,
} from './leads.validator.js';

const leadsRouter = Router();

leadsRouter.get(
  '/stats',
  authorizeStrict(PERMISSIONS.LEADS_READ),
  leadsController.stats
);

leadsRouter.get(
  '/pipeline',
  authorizeStrict(PERMISSIONS.LEADS_READ),
  validateQuery(leadPipelineQuerySchema),
  leadsController.pipeline
);

leadsRouter.get(
  '/',
  authorizeStrict(PERMISSIONS.LEADS_READ),
  validateQuery(leadListQuerySchema),
  leadsController.list
);

leadsRouter.post(
  '/',
  authorizeStrict(PERMISSIONS.LEADS_WRITE),
  validateBody(createLeadSchema),
  leadsController.create
);

leadsRouter.get(
  '/:id',
  authorizeStrict(PERMISSIONS.LEADS_READ),
  validateParams(leadIdParamSchema),
  leadsController.getById
);

leadsRouter.patch(
  '/:id',
  authorizeStrict(PERMISSIONS.LEADS_WRITE),
  validateParams(leadIdParamSchema),
  validateBody(updateLeadSchema),
  leadsController.update
);

leadsRouter.patch(
  '/:id/status',
  authorizeStrict(PERMISSIONS.LEADS_WRITE),
  validateParams(leadIdParamSchema),
  validateBody(updateLeadStatusSchema),
  leadsController.updateStatus
);

leadsRouter.delete(
  '/:id',
  authorizeStrict(PERMISSIONS.LEADS_WRITE),
  validateParams(leadIdParamSchema),
  leadsController.delete
);

leadsRouter.post(
  '/:id/notes',
  authorizeStrict(PERMISSIONS.LEADS_WRITE),
  validateParams(leadIdParamSchema),
  validateBody(createLeadNoteSchema),
  leadsController.addNote
);

leadsRouter.delete(
  '/:id/notes/:noteId',
  authorizeStrict(PERMISSIONS.LEADS_WRITE),
  validateParams(leadNoteIdParamSchema),
  leadsController.deleteNote
);

export { leadsRouter };
