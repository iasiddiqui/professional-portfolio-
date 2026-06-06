import multer from 'multer';
import path from 'path';
import { randomUUID } from 'crypto';

import { env } from '../config/env.js';
import { HTTP_STATUS } from '../constants/http-status.js';
import { AppError } from '../utils/app-error.js';
import { ensureUploadDir, getUploadDir } from '../utils/upload.js';

const storage = multer.diskStorage({
  destination: async (_req, _file, cb) => {
    try {
      await ensureUploadDir();
      cb(null, getUploadDir());
    } catch (error) {
      cb(error as Error, getUploadDir());
    }
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${randomUUID()}${ext}`);
  },
});

const allowedMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

export const uploadImage = multer({
  storage,
  limits: { fileSize: env.MAX_UPLOAD_SIZE_MB * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      cb(new AppError('Only image files are allowed', HTTP_STATUS.UNPROCESSABLE_ENTITY));
      return;
    }

    cb(null, true);
  },
});

export const uploadSingleImage = uploadImage.single('file');
