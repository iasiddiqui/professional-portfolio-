import type { MetadataRoute } from 'next';

import { APP_URL } from '@/constants/api';
import { NOINDEX_ROUTE_PREFIXES } from '@/lib/seo/config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [...NOINDEX_ROUTE_PREFIXES],
      },
    ],
    sitemap: `${APP_URL}/sitemap.xml`,
    host: APP_URL,
  };
}
