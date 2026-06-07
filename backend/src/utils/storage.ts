import { randomUUID } from 'crypto';
import path from 'path';
import type { MediaType } from '@prisma/client';
import fs from 'fs/promises';

import {
  deleteFromCloudinary,
  inferCloudinaryResourceType,
  isCloudinaryConfigured,
  isCloudinaryUrl,
  uploadToCloudinary,
  type CloudinaryResourceType,
} from '../lib/cloudinary.js';
import { env } from '../config/env.js';
import { deleteUploadFile, getPublicUploadUrl, getUploadFilePath } from './upload.js';

export interface UploadedFilePayload {
  buffer: Buffer;
  mimetype: string;
  size: number;
  originalname: string;
}

export interface StoredFile {
  filename: string;
  url: string;
  size: number;
}

/** Safe filename for storage — keeps the original name, strips unsafe characters. */
export function sanitizeUploadFilename(originalname: string): string {
  const base = path.basename(originalname).normalize('NFKC');
  const ext = path.extname(base).toLowerCase();
  const stem = (ext ? base.slice(0, -ext.length) : base).trim() || 'file';

  const safeStem = stem
    .replace(/[^\w\s.-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\s/g, '-')
    .slice(0, 180);

  const safeExt = ext.replace(/[^\w.]/g, '').slice(0, 10);

  return `${safeStem || 'file'}${safeExt}`;
}

async function localFileExists(filename: string): Promise<boolean> {
  try {
    await fs.access(getUploadFilePath(filename));
    return true;
  } catch {
    return false;
  }
}

async function resolveLocalFilename(originalname: string, preserveFilename: boolean): Promise<string> {
  const ext = path.extname(originalname).toLowerCase();

  if (!preserveFilename) {
    return `${randomUUID()}${ext}`;
  }

  let filename = sanitizeUploadFilename(originalname);
  let counter = 2;

  while (await localFileExists(filename)) {
    const stem = path.basename(filename, path.extname(filename));
    filename = `${stem}-${counter}${path.extname(filename)}`;
    counter += 1;
  }

  return filename;
}

function resolveCloudinaryPublicId(
  file: UploadedFilePayload,
  preserveFilename: boolean
): string {
  if (!preserveFilename) {
    const resourceType = inferCloudinaryResourceType(file.mimetype);
    const ext = path.extname(file.originalname).toLowerCase();
    return resourceType === 'raw' ? `${randomUUID()}${ext}` : randomUUID();
  }

  const sanitized = sanitizeUploadFilename(file.originalname);
  return sanitized.replace(/\.[^/.]+$/, '');
}

export function inferMediaTypeFromMime(mimetype: string): MediaType {
  if (mimetype.startsWith('video/')) return 'VIDEO';
  if (mimetype.startsWith('image/')) return 'IMAGE';
  if (
    mimetype === 'application/pdf' ||
    mimetype === 'application/msword' ||
    mimetype.includes('wordprocessingml')
  ) {
    return 'DOCUMENT';
  }
  return 'OTHER';
}

async function storeLocalFile(
  file: UploadedFilePayload,
  preserveFilename = false
): Promise<StoredFile> {
  const filename = await resolveLocalFilename(file.originalname, preserveFilename);
  await fs.writeFile(getUploadFilePath(filename), file.buffer);

  return {
    filename,
    url: getPublicUploadUrl(filename),
    size: file.size,
  };
}

export async function storeUploadedFile(
  file: UploadedFilePayload,
  folder: 'media' | 'resumes'
): Promise<StoredFile> {
  const preserveFilename = folder === 'resumes';

  if (isCloudinaryConfigured()) {
    const resourceType = inferCloudinaryResourceType(file.mimetype);
    const publicId = resolveCloudinaryPublicId(file, preserveFilename);

    const result = await uploadToCloudinary(file.buffer, {
      folder: `${env.CLOUDINARY_FOLDER}/${folder}`,
      resourceType,
      publicId,
      overwrite: preserveFilename,
    });

    return {
      filename: preserveFilename
        ? sanitizeUploadFilename(file.originalname)
        : result.publicId,
      url: result.url,
      size: result.bytes,
    };
  }

  return storeLocalFile(file, preserveFilename);
}

function resolveCloudinaryResourceType(
  mimeType: string | undefined,
  url: string
): CloudinaryResourceType {
  if (mimeType) {
    return inferCloudinaryResourceType(mimeType);
  }

  if (url.includes('/video/upload/')) return 'video';
  if (url.includes('/raw/upload/')) return 'raw';
  return 'image';
}

export async function deleteStoredFile(
  url: string,
  filename: string,
  mimeType?: string
): Promise<void> {
  if (isCloudinaryUrl(url)) {
    await deleteFromCloudinary(filename, resolveCloudinaryResourceType(mimeType, url));
    return;
  }

  await deleteUploadFile(filename);
}

export { isCloudinaryConfigured, isCloudinaryUrl };
