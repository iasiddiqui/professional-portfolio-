import type { Metadata } from 'next';

import { JsonLd } from '@/components/seo/json-ld';
import { ProjectCard } from '@/features/public/components/project-card';
import { PageHero } from '@/features/public/components/page-hero';
import { ROUTES } from '@/constants/routes';
import { buildBreadcrumbSchema, buildCollectionPageSchema } from '@/lib/seo/json-ld';
import { createStaticPageMetadata } from '@/lib/seo/page-metadata';
import { publicApi } from '@/lib/public-api';

const description = 'Selected portfolio projects and product builds.';

export async function generateMetadata(): Promise<Metadata> {
  return createStaticPageMetadata(ROUTES.projects, 'Projects', description);
}

export default async function ProjectsPage() {
  const result = await publicApi.listProjects({ limit: 24 }).catch(() => null);
  const projects = result?.items ?? [];

  return (
    <>
      <JsonLd
        data={[
          buildCollectionPageSchema('Projects', description, ROUTES.projects),
          buildBreadcrumbSchema([
            { name: 'Home', path: ROUTES.home },
            { name: 'Projects', path: ROUTES.projects },
          ]),
        ]}
      />
      <PageHero
        title="Work that ships"
        description="A curated collection of published projects across product engineering, platforms, and tools."
      />

      <section className="container mx-auto px-4 pb-24">
        {projects.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="glass-panel rounded-2xl p-10 text-center text-sm text-muted-foreground">
            No published projects yet. Publish projects in the admin CMS to showcase them here.
          </div>
        )}
      </section>
    </>
  );
}
