import type { Viewport } from 'next';
import { Inter } from 'next/font/google';

import { AppProviders } from '@/providers/app-providers';
import { buildRootMetadata } from '@/lib/seo/metadata';
import { getSeoSiteConfig } from '@/lib/seo/site-config';
import '@/styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  preload: true,
});

export async function generateMetadata() {
  const site = await getSeoSiteConfig();
  return buildRootMetadata(site);
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
