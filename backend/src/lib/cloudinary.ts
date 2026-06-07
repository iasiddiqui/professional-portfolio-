import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary';

import { env } from '../config/env.js';

export type CloudinaryResourceType = 'image' | 'video' | 'raw';

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET
  );
}

function ensureConfigured(): void {
  if (!isCloudinaryConfigured()) {
    throw new Error(
      'Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.'
    );
  }
}

let configured = false;

function configureCloudinary(): void {
  if (configured || !isCloudinaryConfigured()) return;

  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME!,
    api_key: env.CLOUDINARY_API_KEY!,
    api_secret: env.CLOUDINARY_API_SECRET!,
    secure: true,
  });

  configured = true;
}

function normalizeCloudinaryError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }

  if (error && typeof error === 'object') {
    const record = error as Record<string, unknown>;
    const message =
      typeof record.message === 'string'
        ? record.message
        : typeof record.error === 'string'
          ? record.error
          : 'Cloudinary upload failed';

    return new Error(message);
  }

  return new Error('Cloudinary upload failed');
}

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  bytes: number;
  resourceType: CloudinaryResourceType;
}

export async function uploadToCloudinary(
  buffer: Buffer,
  options: {
    folder: string;
    resourceType: CloudinaryResourceType;
    publicId?: string;
  }
): Promise<CloudinaryUploadResult> {
  ensureConfigured();
  configureCloudinary();

  try {
    const result = await cloudinary.uploader.upload(
      `data:application/octet-stream;base64,${buffer.toString('base64')}`,
      {
        folder: options.folder,
        resource_type: options.resourceType,
        ...(options.publicId ? { public_id: options.publicId, use_filename: false } : {}),
      }
    );

    return mapUploadResult(result, options.resourceType);
  } catch (error) {
    throw normalizeCloudinaryError(error);
  }
}

function mapUploadResult(
  result: UploadApiResponse,
  resourceType: CloudinaryResourceType
): CloudinaryUploadResult {
  return {
    url: result.secure_url,
    publicId: result.public_id,
    bytes: result.bytes,
    resourceType,
  };
}

export async function deleteFromCloudinary(
  publicId: string,
  resourceType: CloudinaryResourceType
): Promise<void> {
  if (!isCloudinaryConfigured()) return;

  configureCloudinary();

  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch {
    // Ignore missing assets during cleanup
  }
}

export function isCloudinaryUrl(url: string): boolean {
  return url.includes('res.cloudinary.com');
}

export function inferCloudinaryResourceType(mimetype: string): CloudinaryResourceType {
  if (mimetype.startsWith('video/')) return 'video';
  if (mimetype.startsWith('image/')) return 'image';
  return 'raw';
}
