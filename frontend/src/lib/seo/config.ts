import { APP_URL } from '@/constants/api';
import { resolveAbsoluteMediaUrl } from '@/lib/media-url';

export const SEO_DEFAULTS = {
  siteName: process.env.NEXT_PUBLIC_SITE_NAME ?? 'Portfolio',
  description:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ??
    'Professional portfolio showcasing projects, blog, and services.',
  locale: 'en_US',
  twitterHandle: process.env.NEXT_PUBLIC_TWITTER_HANDLE,
  defaultImagePath: process.env.NEXT_PUBLIC_OG_IMAGE ?? '/og-default.svg',
} as const;

export const INDEXABLE_STATIC_ROUTES = [
  '/',
  '/about',
  '/projects',
  '/services',
  '/blog',
  '/resume',
  '/contact',
  '/ask-ishan',
] as const;

export const NOINDEX_ROUTE_PREFIXES = [
  '/dashboard',
  '/admin',
  '/leads',
  '/analytics',
  '/settings',
  '/login',
  '/register',
] as const;

export function absoluteUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return new URL(normalizedPath, APP_URL).toString();
}

export function resolveSeoImageUrl(image?: string | null): string | undefined {
  if (!image) return absoluteUrl(SEO_DEFAULTS.defaultImagePath);

  const resolved = resolveAbsoluteMediaUrl(image);
  if (resolved) return resolved;

  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image;
  }

  if (image.startsWith('/')) {
    return absoluteUrl(image);
  }

  return image;
}
