import type { GitHubContributions } from '@/features/github/types/github.types';
import { cn } from '@/lib/utils';

interface GitHubContributionsGraphProps {
  contributions: GitHubContributions;
}

function getIntensityClass(count: number): string {
  if (count === 0) return 'bg-muted/40';
  if (count <= 2) return 'bg-accent/25';
  if (count <= 5) return 'bg-accent/45';
  if (count <= 9) return 'bg-accent/70';
  return 'bg-accent';
}

export function GitHubContributionsGraph({ contributions }: GitHubContributionsGraphProps) {
  return (
    <div className="glass-panel rounded-2xl p-6">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">Contributions</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {contributions.totalContributions.toLocaleString()} contributions in the last year
          </p>
        </div>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="inline-flex min-w-max gap-1">
          {contributions.weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day) => (
                <div
                  key={day.date}
                  title={`${day.count} contributions on ${day.date}`}
                  className={cn('h-3 w-3 rounded-sm', getIntensityClass(day.count))}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
