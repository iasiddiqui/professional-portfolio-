import type { Metadata } from 'next';
import Link from 'next/link';

import { JsonLd } from '@/components/seo/json-ld';
import { ConsultationForm } from '@/features/contact/components/contact-form';
import { PageHero } from '@/features/public/components/page-hero';
import { ROUTES } from '@/constants/routes';
import { buildBreadcrumbSchema } from '@/lib/seo/json-ld';
import { createStaticPageMetadata } from '@/lib/seo/page-metadata';
import { publicApi } from '@/lib/public-api';

const description =
  'Request a technical or product consultation. Share context, goals, and preferred meeting times.';

export async function generateMetadata(): Promise<Metadata> {
  return createStaticPageMetadata(ROUTES.consultation, 'Consultation', description);
}

export default async function ConsultationPage() {
  const site = await publicApi.getSite().catch(() => null);

  return (
    <>
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: 'Home', path: ROUTES.home },
          { name: 'Consultation', path: ROUTES.consultation },
        ])}
      />
      <PageHero
        eyebrow="Consultation"
        title="Book a strategy session"
        description="Get focused advice on architecture, delivery, or product direction. Tell me what you’re building and when you’d like to meet."
      />

      <section className="container mx-auto grid gap-8 px-4 pb-24 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
        <ConsultationForm />

        <aside className="space-y-6">
          <div className="glass-panel rounded-2xl p-6">
            <h2 className="mb-4 text-lg font-semibold">Good fit for</h2>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>Architecture reviews and technical planning</li>
              <li>Product scoping before a full build</li>
              <li>Team workflow and delivery audits</li>
              <li>Stack selection and modernization</li>
            </ul>
          </div>

          {site?.contactEmail ? (
            <div className="glass-panel rounded-2xl p-6 text-sm">
              <p className="text-muted-foreground">Direct email</p>
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
              Ready to start a project?{' '}
              <Link href={ROUTES.hireMe} className="font-medium text-accent hover:underline">
                Submit a hire request
              </Link>{' '}
              with full scope details.
            </p>
          </div>
        </aside>
      </section>
    </>
  );
}
