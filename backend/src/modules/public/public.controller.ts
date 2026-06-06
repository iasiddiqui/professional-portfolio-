import type { Request, Response } from 'express';

import { HTTP_STATUS } from '../../constants/http-status.js';
import { asyncHandler } from '../../utils/async-handler.js';
import { buildPaginationMeta, sendPaginated, sendSuccess } from '../../utils/api-response.js';
import { publicService } from './public.service.js';
import type { PublicContactInput, PublicListQueryInput } from './public.validator.js';

export class PublicController {
  getSite = asyncHandler(async (_req: Request, res: Response) => {
    const site = await publicService.getSite();
    sendSuccess(res, site);
  });

  getAbout = asyncHandler(async (_req: Request, res: Response) => {
    const about = await publicService.getAbout();
    sendSuccess(res, about);
  });

  getServices = asyncHandler(async (_req: Request, res: Response) => {
    const services = await publicService.getServices();
    sendSuccess(res, services);
  });

  getTestimonials = asyncHandler(async (_req: Request, res: Response) => {
    const testimonials = await publicService.getTestimonials();
    sendSuccess(res, testimonials);
  });

  getResume = asyncHandler(async (_req: Request, res: Response) => {
    const resume = await publicService.getResume();
    sendSuccess(res, resume);
  });

  listProjects = asyncHandler(async (req: Request, res: Response) => {
    const result = await publicService.listProjects(req.query as unknown as PublicListQueryInput);
    sendPaginated(res, result.items, buildPaginationMeta(result.page, result.limit, result.total));
  });

  getProject = asyncHandler(async (req: Request, res: Response) => {
    const project = await publicService.getProjectBySlug(String(req.params.slug));
    sendSuccess(res, project);
  });

  listBlogPosts = asyncHandler(async (req: Request, res: Response) => {
    const result = await publicService.listBlogPosts(req.query as unknown as PublicListQueryInput);
    sendPaginated(res, result.items, buildPaginationMeta(result.page, result.limit, result.total));
  });

  getBlogPost = asyncHandler(async (req: Request, res: Response) => {
    const post = await publicService.getBlogPostBySlug(String(req.params.slug));
    sendSuccess(res, post);
  });

  submitContact = asyncHandler(async (req: Request, res: Response) => {
    const result = await publicService.submitContact(req.body as PublicContactInput);
    sendSuccess(res, result, { status: HTTP_STATUS.CREATED, message: result.message });
  });
}

export const publicController = new PublicController();
