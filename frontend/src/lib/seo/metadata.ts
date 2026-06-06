import type { Metadata } from 'next';

import { absoluteUrl, resolveSeoImageUrl } from '@/lib/seo/config';
import type { SeoSiteConfig } from '@/lib/seo/site-config';

export interface PageSeoInput {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  keywords?: string[];
  noIndex?: boolean;
}

export function buildMetadata(input: PageSeoInput, site: SeoSiteConfig): Metadata {
  const title = input.title;
  const description = input.description;
  const canonicalPath = input.path.startsWith('/') ? input.path : `/${input.path}`;
  const url = absoluteUrl(canonicalPath);
  const image = resolveSeoImageUrl(input.image ?? site.defaultImage);

  return {
    title,
    description,
    ...(input.keywords?.length ? { keywords: input.keywords } : {}),
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: site.siteName,
      locale: site.locale,
      type: input.type ?? 'website',
      ...(image
        ? {
            images: [
              {
                url: image,
                width: 1200,
                height: 630,
                alt: title,
              },
            ],
          }
        : {}),
      ...(input.publishedTime ? { publishedTime: input.publishedTime } : {}),
      ...(input.modifiedTime ? { modifiedTime: input.modifiedTime } : {}),
      ...(input.authors?.length ? { authors: input.authors } : {}),
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description,
      ...(site.twitterHandle ? { site: site.twitterHandle, creator: site.twitterHandle } : {}),
      ...(image ? { images: [image] } : {}),
    },
    robots: input.noIndex
      ? { index: false, follow: false, nocache: true }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
          },
        },
  };
}

export function buildPageMetadata(
  input: Omit<PageSeoInput, 'title'> & { title: string },
  site: SeoSiteConfig
): Metadata {
  return buildMetadata(input, site);
}

export function buildRootMetadata(site: SeoSiteConfig): Metadata {
  const image = resolveSeoImageUrl(site.defaultImage);

  return {
    metadataBase: new URL(site.url),
    title: {
      default: site.siteName,
      template: `%s | ${site.siteName}`,
    },
    description: site.description,
    applicationName: site.siteName,
    creator: site.siteName,
    publisher: site.siteName,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    alternates: {
      canonical: '/',
      types: {
        'application/rss+xml': `${site.url}/feed.xml`,
      },
    },
    openGraph: {
      type: 'website',
      locale: site.locale,
      url: site.url,
      siteName: site.siteName,
      title: site.siteName,
      description: site.description,
      ...(image ? { images: [{ url: image, width: 1200, height: 630, alt: site.siteName }] } : {}),
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title: site.siteName,
      description: site.description,
      ...(site.twitterHandle ? { site: site.twitterHandle } : {}),
      ...(image ? { images: [image] } : {}),
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export function buildNoIndexMetadata(title: string, site: SeoSiteConfig): Metadata {
  return buildMetadata(
    {
      title,
      description: site.description,
      path: '/',
      noIndex: true,
    },
    site
  );
}
