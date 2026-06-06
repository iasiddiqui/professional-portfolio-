import type { Request, Response } from 'express';

import { asyncHandler } from '../../utils/async-handler.js';
import { sendSuccess } from '../../utils/api-response.js';
import { settingsService } from './settings.service.js';
import type { UpdateSettingsInput } from './settings.validator.js';

export class SettingsController {
  get = asyncHandler(async (_req: Request, res: Response) => {
    const settings = await settingsService.get();
    sendSuccess(res, settings);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const settings = await settingsService.update(
      req.body as UpdateSettingsInput,
      req.user!.permissions
    );
    sendSuccess(res, settings, { message: 'Settings updated successfully' });
  });
}

export const settingsController = new SettingsController();
