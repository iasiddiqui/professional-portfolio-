import type { Metadata } from 'next';

import { JsonLd } from '@/components/seo/json-ld';
import { ContactForm } from '@/features/contact/components/contact-form';
import { ContactPathways } from '@/features/public/components/contact/contact-pathways';
import { ContactSidebar } from '@/features/public/components/contact/contact-sidebar';
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
        title="Let's build something great"
        description="Share your project goals and timeline. I'll follow up with availability, next steps, and how we can work together."
      />

      <section className="container mx-auto w-full space-y-14 px-4 pb-24">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(300px,360px)] lg:items-start">
          <ContactForm />
          <ContactSidebar contactEmail={site?.contactEmail} socialLinks={site?.socialLinks} />
        </div>

        <ContactPathways />
      </section>
    </>
  );
}
