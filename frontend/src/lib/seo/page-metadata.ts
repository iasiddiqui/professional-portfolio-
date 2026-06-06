import { cache } from 'react';

import { getSeoSiteConfig } from '@/lib/seo/site-config';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const createStaticPageMetadata = cache(
  async (path: string, title: string, description: string) => {
    const site = await getSeoSiteConfig();
    return buildPageMetadata({ title, description, path }, site);
  }
);
