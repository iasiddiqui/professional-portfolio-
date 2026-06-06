import type { Metadata } from 'next';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { buildNoIndexMetadata } from '@/lib/seo/metadata';
import { getSeoSiteConfig } from '@/lib/seo/site-config';

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSeoSiteConfig();
  return buildNoIndexMetadata('Page not found', site);
}

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground">The page you are looking for does not exist.</p>
      <Button asChild variant="accent">
        <Link href={ROUTES.home}>Go home</Link>
      </Button>
    </div>
  );
}
