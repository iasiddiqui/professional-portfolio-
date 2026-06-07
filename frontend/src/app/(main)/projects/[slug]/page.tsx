import type { Metadata } from 'next';
import { MediaImage } from '@/components/media/media-image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ExternalLink, Github } from 'lucide-react';

import { JsonLd } from '@/components/seo/json-ld';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ContentRenderer } from '@/features/public/components/content-renderer';
import { ROUTES } from '@/constants/routes';
import { buildBreadcrumbSchema, buildProjectSchema } from '@/lib/seo/json-ld';
import { buildMetadata } from '@/lib/seo/metadata';
import { getSeoSiteConfig } from '@/lib/seo/site-config';
import { publicApi } from '@/lib/public-api';
import { resolveMediaUrl } from '@/lib/media-url';
import type { PublicProject } from '@/features/public/types/public.types';

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const site = await getSeoSiteConfig();

  try {
    const project = await publicApi.getProject(slug);
    return buildMetadata(
      {
        title: project.title,
        description: project.shortDescription,
        path: ROUTES.project(slug),
        image: project.thumbnail?.url ?? null,
        keywords: project.techStack,
      },
      site
    );
  } catch {
    return buildMetadata(
      { title: 'Project not found', description: site.description, path: ROUTES.projects, noIndex: true },
      site
    );
  }
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const site = await getSeoSiteConfig();

  let project: PublicProject;
  try {
    project = await publicApi.getProject(slug);
  } catch {
    notFound();
  }

  const heroImage = resolveMediaUrl(project.thumbnail?.url ?? project.gallery[0]?.url ?? null);

  return (
    <article>
      <JsonLd
        data={[
          buildProjectSchema(project, site),
          buildBreadcrumbSchema([
            { name: 'Home', path: ROUTES.home },
            { name: 'Projects', path: ROUTES.projects },
            { name: project.title, path: ROUTES.project(project.slug) },
          ]),
        ]}
      />

      <section className="container mx-auto px-4 pb-10 pt-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex flex-wrap items-center gap-2">
            {project.category ? <Badge variant="secondary">{project.category.name}</Badge> : null}
            {project.featured ? <Badge variant="accent">Featured</Badge> : null}
          </div>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{project.title}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{project.shortDescription}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            {project.liveUrl ? (
              <Button asChild>
                <a href={project.liveUrl} target="_blank" rel="noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View live
                </a>
              </Button>
            ) : null}
            {project.githubUrl ? (
              <Button asChild variant="outline">
                <a href={project.githubUrl} target="_blank" rel="noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  Source code
                </a>
              </Button>
            ) : null}
          </div>
        </div>
      </section>

      {heroImage ? (
        <section className="container mx-auto px-4 pb-12">
          <div className="relative mx-auto aspect-[16/9] max-w-5xl overflow-hidden rounded-2xl border border-border/60 bg-muted/20">
            <MediaImage src={heroImage} alt={project.title} fill className="object-cover" priority />
          </div>
        </section>
      ) : null}

      <section className="container mx-auto grid max-w-5xl gap-8 px-4 pb-24 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]">
        <div className="space-y-8">
          <div className="glass-panel rounded-2xl p-6 sm:p-8">
            <h2 className="mb-4 text-xl font-semibold">Overview</h2>
            <ContentRenderer content={project.description} className="text-muted-foreground" />
          </div>
          <div className="glass-panel rounded-2xl p-6 sm:p-8">
            <h2 className="mb-4 text-xl font-semibold">Architecture</h2>
            <ContentRenderer content={project.architecture} className="text-muted-foreground" />
          </div>
        </div>

        <aside className="space-y-6">
          <div className="glass-panel rounded-2xl p-6">
            <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Tech stack
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <Badge key={tech} variant="secondary" className="rounded-full">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          {project.gallery.length > 0 ? (
            <div className="glass-panel rounded-2xl p-6">
              <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Gallery
              </h3>
              <div className="space-y-3">
                {project.gallery.map((media) => {
                  const url = resolveMediaUrl(media.url);
                  if (!url) return null;
                  return (
                    <div
                      key={media.id}
                      className="relative aspect-video overflow-hidden rounded-xl border border-border/60"
                    >
                      {media.mimeType.startsWith('video/') ? (
                        <video src={url} className="h-full w-full object-cover" controls preload="metadata" />
                      ) : (
                        <MediaImage src={url} alt={media.alt ?? project.title} fill className="object-cover" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}

          <Button asChild variant="outline" className="w-full">
            <Link href={ROUTES.projects}>Back to projects</Link>
          </Button>
        </aside>
      </section>
    </article>
  );
}
