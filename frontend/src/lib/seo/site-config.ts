import { cache } from 'react';

import { APP_URL } from '@/constants/api';
import { publicApi } from '@/lib/public-api';
import { resolveMediaUrl } from '@/lib/media-url';
import { SEO_DEFAULTS, absoluteUrl } from '@/lib/seo/config';

export interface SeoSiteConfig {
  siteName: string;
  description: string;
  url: string;
  locale: string;
  defaultImage?: string;
  logoUrl?: string;
  contactEmail?: string;
  twitterHandle?: string;
}

export const getSeoSiteConfig = cache(async (): Promise<SeoSiteConfig> => {
  const site = await publicApi.getSite().catch(() => null);

  const siteName = site?.siteName ?? SEO_DEFAULTS.siteName;
  const description = site?.siteDescription ?? SEO_DEFAULTS.description;
  const logoUrl = site?.logoUrl ? resolveMediaUrl(site.logoUrl) ?? undefined : undefined;

  return {
    siteName,
    description,
    url: APP_URL,
    locale: SEO_DEFAULTS.locale,
    defaultImage: logoUrl ?? absoluteUrl(SEO_DEFAULTS.defaultImagePath),
    logoUrl,
    contactEmail: site?.contactEmail ?? undefined,
    twitterHandle: SEO_DEFAULTS.twitterHandle,
  };
});
