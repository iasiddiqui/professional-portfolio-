import type { Metadata } from 'next';

import { ContentRenderer } from '@/features/public/components/content-renderer';
import { GitHubSection } from '@/features/github/components/github-section';
import { PageHero } from '@/features/public/components/page-hero';
import { JsonLd } from '@/components/seo/json-ld';
import { ROUTES } from '@/constants/routes';
import { buildBreadcrumbSchema, buildPersonSchema } from '@/lib/seo/json-ld';
import { createStaticPageMetadata } from '@/lib/seo/page-metadata';
import { getSeoSiteConfig } from '@/lib/seo/site-config';
import { publicApi } from '@/lib/public-api';

export async function generateMetadata(): Promise<Metadata> {
  return createStaticPageMetadata(
    ROUTES.about,
    'About',
    'Background, approach, and experience.'
  );
}

export default async function AboutPage() {
  const site = await getSeoSiteConfig();
  const about = await publicApi.getAbout().catch(() => null);

  if (!about) {
    return (
      <>
        <JsonLd
          data={[
            buildPersonSchema(site),
            buildBreadcrumbSchema([
              { name: 'Home', path: ROUTES.home },
              { name: 'About', path: ROUTES.about },
            ]),
          ]}
        />
        <PageHero
          eyebrow="About"
          title="Engineering with intent"
          description="I design and ship polished digital products with a focus on clarity, performance, and maintainable systems."
        />
        <section className="container mx-auto px-4 pb-24">
          <div className="glass-panel mx-auto max-w-3xl rounded-2xl p-8 text-center text-sm text-muted-foreground">
            About content is unavailable right now. Please ensure the API is running.
          </div>
        </section>
        <GitHubSection />
      </>
    );
  }

  return (
    <>
      <JsonLd
        data={[
          buildPersonSchema(site),
          buildBreadcrumbSchema([
            { name: 'Home', path: ROUTES.home },
            { name: 'About', path: ROUTES.about },
          ]),
        ]}
      />
      <PageHero
        eyebrow="About"
        title="Engineering with intent"
        description={
          about.site.siteDescription ??
          'I design and ship polished digital products with a focus on clarity, performance, and maintainable systems.'
        }
      />

      <section className="container mx-auto px-4 pb-12">
        {about.sections.length > 0 ? (
          <div className="mx-auto grid max-w-4xl gap-6">
            {about.sections.map((section) => (
              <article key={section.id} className="glass-panel rounded-2xl p-6 sm:p-8">
                <h2 className="mb-4 text-xl font-semibold tracking-tight">{section.title}</h2>
                <ContentRenderer content={section.content} className="text-muted-foreground" />
              </article>
            ))}
          </div>
        ) : (
          <div className="glass-panel mx-auto max-w-3xl rounded-2xl p-8 text-center text-sm text-muted-foreground">
            About content will appear here once sections are added to the knowledge base under the
            &quot;about&quot; category.
          </div>
        )}
      </section>

      <GitHubSection />
    </>
  );
}
