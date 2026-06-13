import type { Metadata } from 'next';

import { JsonLd } from '@/components/seo/json-ld';
import { PageHero } from '@/features/public/components/page-hero';
import { ServiceCard } from '@/features/public/components/service-card';
import { ROUTES } from '@/constants/routes';
import { buildBreadcrumbSchema, buildCollectionPageSchema } from '@/lib/seo/json-ld';
import { createStaticPageMetadata } from '@/lib/seo/page-metadata';
import { publicApi } from '@/lib/public-api';

const description = 'Product engineering, platform development, and technical consulting.';

export async function generateMetadata(): Promise<Metadata> {
  return createStaticPageMetadata(ROUTES.services, 'Services', description);
}

export default async function ServicesPage() {
  const services = await publicApi.getServices().catch(() => []);

  return (
    <>
      <JsonLd
        data={[
          buildCollectionPageSchema('Services', description, ROUTES.services),
          buildBreadcrumbSchema([
            { name: 'Home', path: ROUTES.home },
            { name: 'Services', path: ROUTES.services },
          ]),
        ]}
      />
      <PageHero
        title="Built for ambitious products"
        description="From discovery to production — full-stack engineering, architecture, and delivery for teams that care about quality."
      />

      <section className="container mx-auto px-4 pb-24">
        {services.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
        ) : (
          <div className="glass-panel rounded-2xl p-10 text-center text-sm text-muted-foreground">
            Services will appear here once entries are added to the knowledge base under the
            &quot;services&quot; category.
          </div>
        )}
      </section>
    </>
  );
}
