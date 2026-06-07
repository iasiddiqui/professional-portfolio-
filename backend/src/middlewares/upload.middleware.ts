import multer from 'multer';
import path from 'path';

import { env } from '../config/env.js';
import { HTTP_STATUS } from '../constants/http-status.js';
import { AppError } from '../utils/app-error.js';

const storage = multer.memoryStorage();

const allowedImageMimeTypes = new Set([
  'image/jpeg',
  'image/jpg',
  'image/pjpeg',
  'image/png',
  'image/x-png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'image/avif',
  'image/heic',
  'image/heif',
]);

const allowedVideoMimeTypes = new Set([
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/x-msvideo',
  'video/x-matroska',
]);

const allowedDocumentMimeTypes = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

const allowedImageExtensions = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.gif',
  '.svg',
  '.avif',
  '.heic',
  '.heif',
]);

const allowedVideoExtensions = new Set(['.mp4', '.webm', '.mov', '.avi', '.mkv']);
const allowedDocumentExtensions = new Set(['.pdf', '.doc', '.docx']);

function createUpload(options: {
  allowedMimeTypes: Set<string>;
  allowedExtensions?: Set<string>;
  errorMessage: string;
  maxSizeMb: number;
}) {
  return multer({
    storage,
    limits: { fileSize: options.maxSizeMb * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const extensionAllowed = options.allowedExtensions?.has(ext) ?? false;
      const mimeAllowed = options.allowedMimeTypes.has(file.mimetype);

      if (!mimeAllowed && !extensionAllowed) {
        cb(new AppError(options.errorMessage, HTTP_STATUS.UNPROCESSABLE_ENTITY));
        return;
      }

      cb(null, true);
    },
  });
}

export const uploadImage = createUpload({
  allowedMimeTypes: allowedImageMimeTypes,
  allowedExtensions: allowedImageExtensions,
  errorMessage: 'Only image files are allowed',
  maxSizeMb: env.MAX_UPLOAD_SIZE_MB,
});

export const uploadMedia = createUpload({
  allowedMimeTypes: new Set([...allowedImageMimeTypes, ...allowedVideoMimeTypes]),
  allowedExtensions: new Set([...allowedImageExtensions, ...allowedVideoExtensions]),
  errorMessage: 'Only image or video files are allowed',
  maxSizeMb: env.MAX_VIDEO_UPLOAD_SIZE_MB,
});

export const uploadDocument = createUpload({
  allowedMimeTypes: allowedDocumentMimeTypes,
  allowedExtensions: allowedDocumentExtensions,
  errorMessage: 'Only PDF, DOC, or DOCX files are allowed',
  maxSizeMb: env.MAX_UPLOAD_SIZE_MB,
});

function wrapMulter(middleware: ReturnType<typeof uploadMedia.single>) {
  return (req: import('express').Request, res: import('express').Response, next: import('express').NextFunction) => {
    middleware(req, res, (error) => {
      if (!error) {
        next();
        return;
      }

      if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
          next(new AppError('File is too large', HTTP_STATUS.UNPROCESSABLE_ENTITY));
          return;
        }

        next(new AppError(error.message, HTTP_STATUS.BAD_REQUEST));
        return;
      }

      next(error);
    });
  };
}

export const uploadSingleImage = wrapMulter(uploadImage.single('file'));
export const uploadSingleMedia = wrapMulter(uploadMedia.single('file'));
export const uploadSingleDocument = wrapMulter(uploadDocument.single('file'));
