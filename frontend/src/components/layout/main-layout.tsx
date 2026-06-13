import type { ReactNode } from 'react';

import { PageTransition } from '@/components/animations/page-transition';
import { AskIshanFloatingWidget } from '@/features/ai/components/ask-ishan-floating-widget';
import { SiteFooter } from '@/features/public/components/site-footer';
import { SiteHeader } from '@/features/public/components/site-header';
import { VisitorTracker } from '@/features/public/components/visitor-tracker';
import { publicApi } from '@/lib/public-api';

interface MainLayoutProps {
  children: ReactNode;
}

export async function MainLayout({ children }: MainLayoutProps) {
  let siteName = 'Portfolio';
  let contactEmail: string | null = null;
  let socialLinks: Record<string, string> | null = null;

  try {
    const site = await publicApi.getSite();
    siteName = site.siteName;
    contactEmail = site.contactEmail;
    socialLinks = site.socialLinks;
  } catch {
    // Fallback to defaults when API is unavailable during build/dev.
  }

  return (
    <div className="flex min-h-screen flex-col">
      <VisitorTracker />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:shadow-lg"
      >
        Skip to content
      </a>
      <SiteHeader siteName={siteName} />
      <main id="main-content" className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      <SiteFooter siteName={siteName} contactEmail={contactEmail} socialLinks={socialLinks} />
      <AskIshanFloatingWidget />
    </div>
  );
}
