import { ExternalLink, GitFork, Star, Users } from 'lucide-react';

import type { GitHubUserStats } from '@/features/github/types/github.types';

interface GitHubStatsProps {
  stats: GitHubUserStats;
}

const statItems = [
  { key: 'publicRepos', label: 'Repositories', icon: null },
  { key: 'totalStars', label: 'Stars', icon: Star },
  { key: 'followers', label: 'Followers', icon: Users },
  { key: 'totalForks', label: 'Forks', icon: GitFork },
] as const;

export function GitHubStats({ stats }: GitHubStatsProps) {
  return (
    <div className="glass-panel rounded-2xl p-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={stats.avatarUrl}
            alt={stats.username}
            className="h-16 w-16 rounded-2xl border border-border/60"
          />
          <div>
            <h3 className="text-xl font-semibold tracking-tight">{stats.name ?? stats.username}</h3>
            <p className="text-sm text-muted-foreground">@{stats.username}</p>
            {stats.bio ? <p className="mt-2 max-w-xl text-sm text-muted-foreground">{stats.bio}</p> : null}
          </div>
        </div>
        <a
          href={stats.profileUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-sm text-accent hover:underline"
        >
          View profile
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {statItems.map((item) => {
          const Icon = item.icon;
          const value = stats[item.key];

          return (
            <div
              key={item.key}
              className="rounded-xl border border-border/60 bg-muted/20 px-4 py-3"
            >
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
                {item.label}
              </div>
              <p className="mt-1 text-2xl font-semibold tracking-tight">{value.toLocaleString()}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
