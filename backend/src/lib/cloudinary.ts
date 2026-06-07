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
    overwrite?: boolean;
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
        access_mode: 'public',
        type: 'upload',
        ...(options.overwrite ? { overwrite: true, invalidate: true } : {}),
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
  if (mimetype.startsWith('image/') || mimetype === 'application/pdf') return 'image';
  return 'raw';
}

function parseCloudinaryAssetUrl(
  url: string
): { publicId: string; resourceType: CloudinaryResourceType } | null {
  if (!isCloudinaryUrl(url)) return null;

  const match = url.match(
    /res\.cloudinary\.com\/[^/]+\/(image|video|raw)\/upload\/(?:v\d+\/)?([^?]+)/
  );

  if (!match?.[1] || !match[2]) return null;

  return {
    resourceType: match[1] as CloudinaryResourceType,
    publicId: decodeURIComponent(match[2]),
  };
}

function getCloudinaryPrivateDownloadUrl(url: string): string {
  const asset = parseCloudinaryAssetUrl(url);
  if (!asset) return url;

  configureCloudinary();

  const format = asset.publicId.match(/\.([a-z0-9]+)$/i)?.[1] ?? 'pdf';

  return cloudinary.utils.private_download_url(asset.publicId, format, {
    resource_type: asset.resourceType,
    type: 'upload',
    expires_at: Math.floor(Date.now() / 1000) + 60 * 60,
  });
}

/** Deliverable URL — public image/upload assets use CDN URL; raw files use authenticated download. */
export function getCloudinaryDeliveryUrl(url: string): string {
  if (!isCloudinaryConfigured()) return url;

  const asset = parseCloudinaryAssetUrl(url);
  if (!asset) return url;

  if (asset.resourceType === 'raw') {
    return getCloudinaryPrivateDownloadUrl(url);
  }

  return url;
}

export function resolveDeliverableFileUrl(url: string): string {
  if (isCloudinaryUrl(url)) {
    return getCloudinaryDeliveryUrl(url);
  }

  return url;
}
