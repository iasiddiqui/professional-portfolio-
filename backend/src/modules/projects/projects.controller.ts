import type { Request, Response } from 'express';

import { PERMISSIONS } from '../../constants/permissions.js';
import { HTTP_STATUS } from '../../constants/http-status.js';
import { asyncHandler } from '../../utils/async-handler.js';
import { buildPaginationMeta, sendPaginated, sendSuccess } from '../../utils/api-response.js';
import { projectsService } from './projects.service.js';
import type {
  CreateProjectInput,
  ProjectListQueryInput,
  UpdateProjectInput,
  UpdateProjectStatusInput,
} from './projects.validator.js';

export class ProjectsController {
  list = asyncHandler(async (req: Request, res: Response) => {
    const result = await projectsService.list(req.query as unknown as ProjectListQueryInput);

    sendPaginated(res, result.items, buildPaginationMeta(result.page, result.limit, result.total));
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const project = await projectsService.getById(String(req.params.id));
    sendSuccess(res, project);
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const project = await projectsService.create(
      req.body as CreateProjectInput,
      req.user!.permissions
    );

    sendSuccess(res, project, { status: HTTP_STATUS.CREATED, message: 'Project created successfully' });
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const project = await projectsService.update(
      String(req.params.id),
      req.body as UpdateProjectInput,
      req.user!.permissions
    );

    sendSuccess(res, project, { message: 'Project updated successfully' });
  });

  updateStatus = asyncHandler(async (req: Request, res: Response) => {
    const project = await projectsService.updateStatus(
      String(req.params.id),
      req.body as UpdateProjectStatusInput,
      req.user!.permissions
    );

    sendSuccess(res, project, { message: 'Project status updated successfully' });
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const result = await projectsService.delete(String(req.params.id), req.user!.permissions);
    sendSuccess(res, result, { message: 'Project deleted successfully' });
  });
}

export const projectsController = new ProjectsController();

export const projectsReadGuards = [PERMISSIONS.PROJECTS_READ] as const;
export const projectsWriteGuards = [PERMISSIONS.PROJECTS_WRITE] as const;
export const projectsDeleteGuards = [PERMISSIONS.PROJECTS_DELETE] as const;
