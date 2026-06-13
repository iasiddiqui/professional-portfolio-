import Link from 'next/link';
import { ArrowRight, Quote } from 'lucide-react';
import type { Metadata } from 'next';

import { JsonLd } from '@/components/seo/json-ld';
import { Button } from '@/components/ui/button';
import { BlogCard } from '@/features/public/components/blog-card';
import { GridBackground } from '@/features/public/components/grid-background';
import { ProjectCard } from '@/features/public/components/project-card';
import { SectionHeading } from '@/features/public/components/section-heading';
import { ROUTES } from '@/constants/routes';
import {
  buildOrganizationSchema,
  buildPersonSchema,
  buildWebSiteSchema,
} from '@/lib/seo/json-ld';
import { createStaticPageMetadata } from '@/lib/seo/page-metadata';
import { getSeoSiteConfig } from '@/lib/seo/site-config';
import { publicApi } from '@/lib/public-api';

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSeoSiteConfig();
  return createStaticPageMetadata(ROUTES.home, site.siteName, site.description);
}

export default async function HomePage() {
  const siteConfig = await getSeoSiteConfig();
  const [site, featuredProjects, recentPosts, testimonials] = await Promise.all([
    publicApi.getSite().catch(() => null),
    publicApi.listProjects({ limit: 3, featured: true }).catch(() => null),
    publicApi.listBlogPosts({ limit: 3 }).catch(() => null),
    publicApi.getTestimonials().catch(() => []),
  ]);

  let projects = featuredProjects?.items ?? [];
  if (projects.length === 0) {
    const fallback = await publicApi.listProjects({ limit: 3 }).catch(() => null);
    projects = fallback?.items ?? [];
  }

  return (
    <>
      <JsonLd
        data={[
          buildWebSiteSchema(siteConfig),
          buildOrganizationSchema(siteConfig),
          buildPersonSchema(siteConfig),
        ]}
      />

      <GridBackground>
        <section className="container mx-auto px-4 pb-20 pt-24 sm:pt-28">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-semibold tracking-tight text-gradient sm:text-6xl lg:text-7xl">
              {site?.siteName ?? 'Portfolio'}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {site?.siteDescription ??
                'Premium software experiences crafted with precision, performance, and product thinking.'}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg">
                <Link href={ROUTES.projects}>
                  View projects
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href={ROUTES.contact}>Start a project</Link>
              </Button>
            </div>
          </div>
        </section>
      </GridBackground>

      <section className="container mx-auto px-4 py-20">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Selected Work"
            title="Featured projects"
            description="Production-grade builds across web apps, platforms, and internal tools."
          />
          <Button asChild variant="ghost">
            <Link href={ROUTES.projects}>
              All projects
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {projects.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="glass-panel rounded-2xl p-10 text-center text-sm text-muted-foreground">
            Published projects will appear here once they are live in the CMS.
          </div>
        )}
      </section>

      <section className="border-y border-border/60 bg-muted/20 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="Writing"
              title="Latest from the blog"
              description="Notes on engineering, product, and building in production."
            />
            <Button asChild variant="ghost">
              <Link href={ROUTES.blog}>
                Read the blog
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {(recentPosts?.items.length ?? 0) > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {recentPosts!.items.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="glass-panel rounded-2xl p-10 text-center text-sm text-muted-foreground">
              Published blog posts will appear here.
            </div>
          )}
        </div>
      </section>

      {testimonials.length > 0 ? (
        <section className="container mx-auto px-4 py-20">
          <SectionHeading
            eyebrow="Testimonials"
            title="Trusted by teams"
            description="Feedback from collaborators and clients."
            align="center"
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {testimonials.map((testimonial) => (
              <article key={testimonial.id} className="glass-panel rounded-2xl p-6">
                <Quote className="mb-4 h-5 w-5 text-accent" />
                <p className="text-sm leading-relaxed text-muted-foreground">{testimonial.content}</p>
                <div className="mt-5 border-t border-border/60 pt-4">
                  <p className="font-medium">{testimonial.clientName}</p>
                  <p className="text-xs text-muted-foreground">
                    {[testimonial.designation, testimonial.company].filter(Boolean).join(' · ')}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="container mx-auto px-4 pb-24">
        <div className="glass-panel relative overflow-hidden rounded-3xl px-6 py-12 sm:px-10 sm:py-14">
          <div aria-hidden className="absolute inset-0 linear-glow opacity-70" />
          <div className="relative mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Ready to build something exceptional?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Tell me about your product, timeline, and goals. I typically respond within one business day.
            </p>
            <Button asChild size="lg" className="mt-8">
              <Link href={ROUTES.contact}>Get in touch</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
