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

async function storeLocalFile(file: UploadedFilePayload): Promise<StoredFile> {
  const ext = path.extname(file.originalname).toLowerCase();
  const filename = `${randomUUID()}${ext}`;
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
  if (isCloudinaryConfigured()) {
    const resourceType = inferCloudinaryResourceType(file.mimetype);
    const ext = path.extname(file.originalname).toLowerCase();
    const publicId =
      resourceType === 'raw' ? `${randomUUID()}${ext}` : randomUUID();

    const result = await uploadToCloudinary(file.buffer, {
      folder: `${env.CLOUDINARY_FOLDER}/${folder}`,
      resourceType,
      publicId,
    });

    return {
      filename: result.publicId,
      url: result.url,
      size: result.bytes,
    };
  }

  return storeLocalFile(file);
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
