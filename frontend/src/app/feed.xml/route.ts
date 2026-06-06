import { NextResponse } from 'next/server';

import { ROUTES } from '@/constants/routes';
import { absoluteUrl } from '@/lib/seo/config';
import { getSeoSiteConfig } from '@/lib/seo/site-config';
import { publicApi } from '@/lib/public-api';

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const site = await getSeoSiteConfig();
  const posts = await publicApi.listBlogPosts({ limit: 50 }).catch(() => null);

  const items =
    posts?.items
      .map((post) => {
        const link = absoluteUrl(ROUTES.blogPost(post.slug));
        const pubDate = post.publishedAt ? new Date(post.publishedAt).toUTCString() : new Date().toUTCString();

        return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${link}</link>
      <guid>${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(post.excerpt)}</description>
    </item>`;
      })
      .join('') ?? '';

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(site.siteName)} Blog</title>
    <link>${absoluteUrl(ROUTES.blog)}</link>
    <description>${escapeXml(site.description)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${absoluteUrl('/feed.xml')}" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new NextResponse(xml.trim(), {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
