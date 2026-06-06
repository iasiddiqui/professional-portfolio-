import { Router } from 'express';

import { PERMISSIONS } from '../../constants/permissions.js';
import { authorizeStrict } from '../../middlewares/role.middleware.js';
import { validateBody, validateParams, validateQuery } from '../../middlewares/validate.middleware.js';
import { knowledgeBaseController } from './knowledge-base.controller.js';
import {
  createKnowledgeBaseSchema,
  knowledgeBaseIdParamSchema,
  knowledgeBaseListQuerySchema,
  updateKnowledgeBaseSchema,
} from './knowledge-base.validator.js';

const knowledgeBaseRouter = Router();

knowledgeBaseRouter.get(
  '/categories',
  authorizeStrict(PERMISSIONS.KNOWLEDGE_BASE_READ),
  knowledgeBaseController.getCategories
);

knowledgeBaseRouter.get(
  '/',
  authorizeStrict(PERMISSIONS.KNOWLEDGE_BASE_READ),
  validateQuery(knowledgeBaseListQuerySchema),
  knowledgeBaseController.list
);

knowledgeBaseRouter.get(
  '/:id',
  authorizeStrict(PERMISSIONS.KNOWLEDGE_BASE_READ),
  validateParams(knowledgeBaseIdParamSchema),
  knowledgeBaseController.getById
);

knowledgeBaseRouter.post(
  '/',
  authorizeStrict(PERMISSIONS.KNOWLEDGE_BASE_WRITE),
  validateBody(createKnowledgeBaseSchema),
  knowledgeBaseController.create
);

knowledgeBaseRouter.patch(
  '/:id',
  authorizeStrict(PERMISSIONS.KNOWLEDGE_BASE_WRITE),
  validateParams(knowledgeBaseIdParamSchema),
  validateBody(updateKnowledgeBaseSchema),
  knowledgeBaseController.update
);

knowledgeBaseRouter.delete(
  '/:id',
  authorizeStrict(PERMISSIONS.KNOWLEDGE_BASE_WRITE),
  validateParams(knowledgeBaseIdParamSchema),
  knowledgeBaseController.delete
);

export { knowledgeBaseRouter };
