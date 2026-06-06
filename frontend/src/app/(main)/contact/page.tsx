import type { Metadata } from 'next';

import { JsonLd } from '@/components/seo/json-ld';
import { ContactForm } from '@/features/contact/components/contact-form';
import { PageHero } from '@/features/public/components/page-hero';
import { ROUTES } from '@/constants/routes';
import { buildBreadcrumbSchema } from '@/lib/seo/json-ld';
import { createStaticPageMetadata } from '@/lib/seo/page-metadata';
import { publicApi } from '@/lib/public-api';

export async function generateMetadata(): Promise<Metadata> {
  return createStaticPageMetadata(
    ROUTES.contact,
    'Contact',
    'Start a project or reach out for collaboration.'
  );
}

export default async function ContactPage() {
  const site = await publicApi.getSite().catch(() => null);

  return (
    <>
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: 'Home', path: ROUTES.home },
          { name: 'Contact', path: ROUTES.contact },
        ])}
      />
      <PageHero
        eyebrow="Contact"
        title="Let’s build something great"
        description="Share your project details, timeline, and goals. I’ll follow up with next steps and availability."
      />

      <section className="container mx-auto grid gap-8 px-4 pb-24 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
        <ContactForm />

        <aside className="space-y-6">
          <div className="glass-panel rounded-2xl p-6">
            <h2 className="mb-4 text-lg font-semibold">Direct contact</h2>
            <div className="space-y-4 text-sm">
              {site?.contactEmail ? (
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <a href={`mailto:${site.contactEmail}`} className="font-medium text-accent hover:underline">
                    {site.contactEmail}
                  </a>
                </div>
              ) : null}
              <div>
                <p className="text-muted-foreground">Availability</p>
                <p className="font-medium">Remote · Contract & full-time</p>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-6 text-sm text-muted-foreground">
            <p>
              Typical engagements include product builds, platform modernization, admin dashboards,
              and full-stack delivery with a focus on maintainable architecture.
            </p>
          </div>
        </aside>
      </section>
    </>
  );
}
