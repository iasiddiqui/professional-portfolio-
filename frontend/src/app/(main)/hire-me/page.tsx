import type { Metadata } from 'next';
import Link from 'next/link';

import { JsonLd } from '@/components/seo/json-ld';
import { HireMeForm } from '@/features/contact/components/contact-form';
import { PageHero } from '@/features/public/components/page-hero';
import { ROUTES } from '@/constants/routes';
import { buildBreadcrumbSchema } from '@/lib/seo/json-ld';
import { createStaticPageMetadata } from '@/lib/seo/page-metadata';
import { publicApi } from '@/lib/public-api';

const description =
  'Submit a hire request for full-stack engineering, product builds, and long-term collaboration.';

export async function generateMetadata(): Promise<Metadata> {
  return createStaticPageMetadata(ROUTES.hireMe, 'Hire Me', description);
}

export default async function HireMePage() {
  const site = await publicApi.getSite().catch(() => null);

  return (
    <>
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: 'Home', path: ROUTES.home },
          { name: 'Hire Me', path: ROUTES.hireMe },
        ])}
      />
      <PageHero
        title="Let’s work together"
        description="Looking for a senior engineer to ship your product? Share scope, budget, and timeline — I’ll respond with availability and next steps."
      />

      <section className="container mx-auto grid gap-8 px-4 pb-24 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
        <HireMeForm />

        <aside className="space-y-6">
          <div className="glass-panel rounded-2xl p-6">
            <h2 className="mb-4 text-lg font-semibold">What to include</h2>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>Project goals and expected deliverables</li>
              <li>Preferred start date and engagement length</li>
              <li>Budget range or rate expectations</li>
              <li>Team structure and communication preferences</li>
            </ul>
          </div>

          {site?.contactEmail ? (
            <div className="glass-panel rounded-2xl p-6 text-sm">
              <p className="text-muted-foreground">Prefer email?</p>
              <a
                href={`mailto:${site.contactEmail}`}
                className="mt-1 inline-block font-medium text-accent hover:underline"
              >
                {site.contactEmail}
              </a>
            </div>
          ) : null}

          <div className="glass-panel rounded-2xl p-6 text-sm text-muted-foreground">
            <p>
              Need a shorter call first?{' '}
              <Link href={ROUTES.consultation} className="font-medium text-accent hover:underline">
                Request a consultation
              </Link>{' '}
              instead.
            </p>
          </div>
        </aside>
      </section>
    </>
  );
}
