import type { Request, Response } from 'express';

import { asyncHandler } from '../../utils/async-handler.js';
import { sendSuccess } from '../../utils/api-response.js';
import { githubService } from '../../services/github/github.service.js';

export class GitHubController {
  getOverview = asyncHandler(async (_req: Request, res: Response) => {
    const overview = await githubService.getOverview();
    sendSuccess(res, overview);
  });

  getStats = asyncHandler(async (_req: Request, res: Response) => {
    const stats = await githubService.getStats();
    sendSuccess(res, stats);
  });

  getRepositories = asyncHandler(async (_req: Request, res: Response) => {
    const repositories = await githubService.getRepositories();
    sendSuccess(res, repositories);
  });

  getLanguages = asyncHandler(async (_req: Request, res: Response) => {
    const languages = await githubService.getLanguages();
    sendSuccess(res, languages);
  });

  getContributions = asyncHandler(async (_req: Request, res: Response) => {
    const contributions = await githubService.getContributions();
    sendSuccess(res, contributions);
  });
}

export const githubController = new GitHubController();
