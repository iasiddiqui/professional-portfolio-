import { API_ORIGIN, APP_URL } from '@/constants/api';

function toUploadPath(url: string): string | null {
  if (url.startsWith('/uploads/')) {
    return url;
  }

  if (url.startsWith('uploads/')) {
    return `/${url}`;
  }

  if (url.startsWith('http://') || url.startsWith('https://')) {
    try {
      const parsed = new URL(url);
      if (parsed.pathname.startsWith('/uploads/')) {
        return `${parsed.pathname}${parsed.search}`;
      }
    } catch {
      return null;
    }
  }

  return null;
}

/**
 * Resolves media URLs for UI rendering. Upload paths are served same-origin via
 * Next.js rewrite (/uploads → API) so admin client components can load images.
 */
export function resolveMediaUrl(url: string | null | undefined): string | null {
  if (!url) return null;

  const uploadPath = toUploadPath(url);
  if (uploadPath) return uploadPath;

  if (url.startsWith('http://') || url.startsWith('https://')) return url;

  return `${API_ORIGIN}${url.startsWith('/') ? url : `/${url}`}`;
}

/** Fully qualified URL for SEO metadata and JSON-LD. */
export function resolveAbsoluteMediaUrl(url: string | null | undefined): string | null {
  const resolved = resolveMediaUrl(url);
  if (!resolved) return null;

  if (resolved.startsWith('http://') || resolved.startsWith('https://')) {
    return resolved;
  }

  if (resolved.startsWith('/')) {
    return `${APP_URL.replace(/\/$/, '')}${resolved}`;
  }

  return `${API_ORIGIN}/${resolved}`;
}
