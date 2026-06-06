import { GitHubContributionsGraph } from '@/features/github/components/github-contributions';
import { GitHubLanguages } from '@/features/github/components/github-languages';
import { GitHubRepositories } from '@/features/github/components/github-repositories';
import { GitHubStats } from '@/features/github/components/github-stats';
import { githubApi } from '@/features/github/services/github.service';
import { SectionHeading } from '@/features/public/components/section-heading';

export async function GitHubSection() {
  const data = await githubApi.getOverview().catch(() => null);

  if (!data) {
    return (
      <section className="container mx-auto px-4 pb-24">
        <SectionHeading
          eyebrow="Open Source"
          title="GitHub activity"
          description="Live stats from GitHub when the API is configured."
        />
        <div className="glass-panel mt-8 rounded-2xl p-8 text-center text-sm text-muted-foreground">
          GitHub data is unavailable. Set GITHUB_TOKEN and GITHUB_USERNAME in the backend.
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto space-y-6 px-4 pb-24">
      <SectionHeading
        eyebrow="Open Source"
        title="GitHub activity"
        description="Live profile stats, contribution history, languages, and featured repositories."
      />

      <GitHubStats stats={data.stats} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,1fr)]">
        <GitHubContributionsGraph contributions={data.contributions} />
        <GitHubLanguages languages={data.languages} />
      </div>

      <GitHubRepositories repositories={data.repositories} />
    </section>
  );
}
