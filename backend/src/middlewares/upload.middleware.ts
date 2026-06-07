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

const allowedImageMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

const allowedDocumentMimeTypes = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

const allowedDocumentExtensions = new Set(['.pdf', '.doc', '.docx']);

function createUpload(options: {
  allowedMimeTypes: Set<string>;
  allowedExtensions?: Set<string>;
  errorMessage: string;
}) {
  return multer({
    storage,
    limits: { fileSize: env.MAX_UPLOAD_SIZE_MB * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const extensionAllowed = options.allowedExtensions?.has(ext) ?? false;

      if (!options.allowedMimeTypes.has(file.mimetype) && !extensionAllowed) {
        cb(new AppError(options.errorMessage, HTTP_STATUS.UNPROCESSABLE_ENTITY));
        return;
      }

      cb(null, true);
    },
  });
}

export const uploadImage = createUpload({
  allowedMimeTypes: allowedImageMimeTypes,
  errorMessage: 'Only image files are allowed',
});

export const uploadDocument = createUpload({
  allowedMimeTypes: allowedDocumentMimeTypes,
  allowedExtensions: allowedDocumentExtensions,
  errorMessage: 'Only PDF, DOC, or DOCX files are allowed',
});

export const uploadSingleImage = uploadImage.single('file');
export const uploadSingleDocument = uploadDocument.single('file');
