import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: process.env.NEXT_PUBLIC_SITE_NAME ?? 'Portfolio',
    short_name: process.env.NEXT_PUBLIC_SITE_NAME ?? 'Portfolio',
    description:
      process.env.NEXT_PUBLIC_SITE_DESCRIPTION ??
      'Professional portfolio showcasing projects, case studies, blog, and services.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#0a0a0a',
    icons: [
      {
        src: '/og-default.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
