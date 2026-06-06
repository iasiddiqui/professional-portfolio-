import type { Request, Response } from 'express';

import { HTTP_STATUS } from '../../constants/http-status.js';
import { asyncHandler } from '../../utils/async-handler.js';
import { buildPaginationMeta, sendPaginated, sendSuccess } from '../../utils/api-response.js';
import { leadsService } from './leads.service.js';
import type {
  CreateLeadInput,
  CreateLeadNoteInput,
  LeadListQueryInput,
  UpdateLeadInput,
  UpdateLeadStatusInput,
} from './leads.validator.js';

export class LeadsController {
  list = asyncHandler(async (req: Request, res: Response) => {
    const result = await leadsService.list(req.query as unknown as LeadListQueryInput);
    sendPaginated(res, result.items, buildPaginationMeta(result.page, result.limit, result.total));
  });

  stats = asyncHandler(async (_req: Request, res: Response) => {
    const stats = await leadsService.getStats();
    sendSuccess(res, stats);
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const lead = await leadsService.getById(String(req.params.id));
    sendSuccess(res, lead);
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const lead = await leadsService.create(req.body as CreateLeadInput, req.user!.permissions);
    sendSuccess(res, lead, { status: HTTP_STATUS.CREATED, message: 'Lead created successfully' });
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const lead = await leadsService.update(
      String(req.params.id),
      req.body as UpdateLeadInput,
      req.user!.permissions
    );
    sendSuccess(res, lead, { message: 'Lead updated successfully' });
  });

  updateStatus = asyncHandler(async (req: Request, res: Response) => {
    const lead = await leadsService.updateStatus(
      String(req.params.id),
      req.body as UpdateLeadStatusInput,
      req.user!.permissions
    );
    sendSuccess(res, lead, { message: 'Lead status updated successfully' });
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const result = await leadsService.delete(String(req.params.id), req.user!.permissions);
    sendSuccess(res, result, { message: 'Lead deleted successfully' });
  });

  addNote = asyncHandler(async (req: Request, res: Response) => {
    const lead = await leadsService.addNote(
      String(req.params.id),
      req.body as CreateLeadNoteInput,
      req.user!.id,
      req.user!.permissions
    );
    sendSuccess(res, lead, { message: 'Note added successfully' });
  });

  deleteNote = asyncHandler(async (req: Request, res: Response) => {
    const lead = await leadsService.deleteNote(
      String(req.params.id),
      String(req.params.noteId),
      req.user!.permissions
    );
    sendSuccess(res, lead, { message: 'Note deleted successfully' });
  });
}

export const leadsController = new LeadsController();
