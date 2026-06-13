import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Github, Mail } from 'lucide-react';

import { AboutPageSections } from '@/features/public/components/about/about-page-sections';
import { PageHero } from '@/features/public/components/page-hero';
import { JsonLd } from '@/components/seo/json-ld';
import { Button } from '@/components/ui/button';
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

  const heroDescription =
    about?.site.siteDescription ??
    'I design and ship polished digital products with a focus on clarity, performance, and maintainable systems.';

  const heroActions = (
    <>
      <Button asChild size="lg">
        <Link href={ROUTES.contact}>
          Get in touch
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
      <Button asChild variant="outline" size="lg">
        <Link href={ROUTES.projects}>View projects</Link>
      </Button>
    </>
  );

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
          title="About Me"
          description={heroDescription}
          actions={heroActions}
        />
        <section className="container mx-auto px-4 pb-24">
          <div className="glass-panel mx-auto max-w-3xl rounded-2xl p-8 text-center text-sm text-muted-foreground">
            About content is unavailable right now. Please ensure the API is running.
          </div>
        </section>
      </>
    );
  }

  const socialLinks = about.site.socialLinks;
  const githubUrl = socialLinks?.github;

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
        title="About Me"
        description={heroDescription}
        actions={
          <>
            {heroActions}
            {githubUrl ? (
              <Button asChild variant="ghost" size="lg">
                <a href={githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </a>
              </Button>
            ) : (
              <Button asChild variant="ghost" size="lg">
                <Link href={ROUTES.contact}>
                  <Mail className="mr-2 h-4 w-4" />
                  Email me
                </Link>
              </Button>
            )}
          </>
        }
      />

      {about.sections.length > 0 ? (
        <AboutPageSections sections={about.sections} />
      ) : (
        <section className="container mx-auto px-4 pb-24">
          <div className="glass-panel mx-auto max-w-3xl rounded-2xl p-8 text-center text-sm text-muted-foreground">
            About content will appear here once sections are added in the admin About page.
          </div>
        </section>
      )}

    </>
  );
}
