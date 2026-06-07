import Link from 'next/link';
import { MediaImage } from '@/components/media/media-image';
import { ArrowUpRight, Github, Globe } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/constants/routes';
import type { PublicProjectSummary } from '@/features/public/types/public.types';
import { resolveMediaUrl } from '@/lib/media-url';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: PublicProjectSummary;
  className?: string;
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  const thumbnail = resolveMediaUrl(project.thumbnail?.url ?? null);

  return (
    <article
      className={cn(
        'group glass-panel relative overflow-hidden rounded-2xl transition-all duration-300 hover:border-border hover:shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_20px_50px_-20px_rgba(0,0,0,0.5)]',
        className
      )}
    >
      <Link href={ROUTES.project(project.slug)} className="block">
        <div className="relative aspect-[16/10] overflow-hidden bg-muted/30">
          {thumbnail ? (
            <MediaImage
              src={thumbnail}
              alt={project.thumbnail?.alt ?? project.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              {project.title}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
        </div>

        <div className="space-y-4 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              {project.category ? (
                <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
                  {project.category.name}
                </p>
              ) : null}
              <h3 className="text-xl font-semibold tracking-tight">{project.title}</h3>
            </div>
            <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
          </div>

          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {project.shortDescription}
          </p>

          <div className="flex flex-wrap gap-2">
            {project.techStack.slice(0, 4).map((tech) => (
              <Badge key={tech} variant="secondary" className="rounded-full px-2.5 py-0.5 text-xs">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </Link>

      {(project.liveUrl || project.githubUrl) && (
        <div className="flex gap-2 border-t border-border/60 px-6 py-3">
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <Globe className="h-3.5 w-3.5" />
              Live
            </a>
          ) : null}
          {project.githubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <Github className="h-3.5 w-3.5" />
              Code
            </a>
          ) : null}
        </div>
      )}
    </article>
  );
}
