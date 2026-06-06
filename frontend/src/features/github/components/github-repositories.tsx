import { ExternalLink, GitFork, Star } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import type { GitHubRepository } from '@/features/github/types/github.types';
import { formatDate } from '@/utils/date';

interface GitHubRepositoriesProps {
  repositories: GitHubRepository[];
}

export function GitHubRepositories({ repositories }: GitHubRepositoriesProps) {
  if (repositories.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-6 text-sm text-muted-foreground">
        No public repositories found.
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl p-6">
      <h3 className="mb-4 text-lg font-semibold tracking-tight">Repositories</h3>
      <div className="grid gap-4 md:grid-cols-2">
        {repositories.map((repo) => (
          <article
            key={repo.id}
            className="rounded-xl border border-border/60 bg-muted/10 p-4 transition-colors hover:border-border"
          >
            <div className="mb-2 flex items-start justify-between gap-3">
              <a
                href={repo.url}
                target="_blank"
                rel="noreferrer"
                className="font-medium hover:text-accent"
              >
                {repo.name}
              </a>
              <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
            </div>

            {repo.description ? (
              <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">{repo.description}</p>
            ) : null}

            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              {repo.language ? (
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-accent" />
                  {repo.language}
                </span>
              ) : null}
              <span className="inline-flex items-center gap-1">
                <Star className="h-3.5 w-3.5" />
                {repo.stars}
              </span>
              <span className="inline-flex items-center gap-1">
                <GitFork className="h-3.5 w-3.5" />
                {repo.forks}
              </span>
              <span>Updated {formatDate(repo.updatedAt)}</span>
            </div>

            {repo.topics.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {repo.topics.slice(0, 4).map((topic) => (
                  <Badge key={topic} variant="secondary" className="rounded-full text-xs">
                    {topic}
                  </Badge>
                ))}
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}
