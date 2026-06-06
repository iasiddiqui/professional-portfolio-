import fs from 'fs/promises';
import path from 'path';

import { env } from '../config/env.js';

export function getUploadDir(): string {
  return path.resolve(process.cwd(), env.UPLOAD_DIR);
}

export function getPublicUploadUrl(filename: string): string {
  return `${env.PUBLIC_URL}/uploads/${filename}`;
}

export function getUploadFilePath(filename: string): string {
  return path.join(getUploadDir(), filename);
}

export async function ensureUploadDir(): Promise<void> {
  await fs.mkdir(getUploadDir(), { recursive: true });
}

export async function deleteUploadFile(filename: string): Promise<void> {
  try {
    await fs.unlink(getUploadFilePath(filename));
  } catch {
    // Ignore missing files during cleanup
  }
}

export function extractFilenameFromUrl(url: string): string | null {
  const marker = '/uploads/';
  const index = url.indexOf(marker);

  if (index === -1) {
    return null;
  }

  return url.slice(index + marker.length);
}
