import { env } from '../../config/env.js';
import { TtlCache } from '../../lib/ttl-cache.js';
import { githubClient } from './github.client.js';
import { getLanguageColor } from './github.constants.js';
import type {
  GitHubContributions,
  GitHubLanguageStat,
  GitHubOverview,
  GitHubRepository,
  GitHubUserStats,
} from './github.types.js';

interface GitHubRestUser {
  login: string;
  name: string | null;
  bio: string | null;
  avatar_url: string;
  html_url: string;
  location: string | null;
  public_repos: number;
  followers: number;
  following: number;
}

interface GitHubRestRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  topics?: string[];
  updated_at: string;
  pushed_at: string | null;
  fork: boolean;
  private: boolean;
}

interface GitHubGraphQLContributionsResponse {
  data: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number;
          weeks: Array<{
            contributionDays: Array<{
              contributionCount: number;
              date: string;
            }>;
          }>;
        };
      };
    } | null;
  };
}

export class GitHubService {
  private readonly cache = new TtlCache<unknown>(env.GITHUB_CACHE_TTL_MS);
  private resolvedUsername: string | null = null;

  private cacheKey(resource: string, username: string): string {
    return `github:${resource}:${username}`;
  }

  private async resolveUsername(): Promise<string> {
    if (this.resolvedUsername) return this.resolvedUsername;
    if (env.GITHUB_USERNAME) {
      this.resolvedUsername = env.GITHUB_USERNAME;
      return this.resolvedUsername;
    }

    const user = await githubClient.get<GitHubRestUser>('/user');
    this.resolvedUsername = user.login;
    return user.login;
  }

  async getStats(): Promise<GitHubUserStats> {
    const username = await this.resolveUsername();
    const cacheKey = this.cacheKey('stats', username);
    const cached = this.cache.get(cacheKey) as GitHubUserStats | null;
    if (cached) return cached;

    const [user, repos] = await Promise.all([
      githubClient.get<GitHubRestUser>(`/users/${username}`),
      githubClient.get<GitHubRestRepo[]>(`/users/${username}/repos?per_page=100&sort=updated`),
    ]);

    const publicRepos = repos.filter((repo) => !repo.private);
    const totalStars = publicRepos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    const totalForks = publicRepos.reduce((sum, repo) => sum + repo.forks_count, 0);

    const stats: GitHubUserStats = {
      username: user.login,
      name: user.name,
      bio: user.bio,
      avatarUrl: user.avatar_url,
      profileUrl: user.html_url,
      location: user.location,
      publicRepos: user.public_repos,
      followers: user.followers,
      following: user.following,
      totalStars,
      totalForks,
    };

    this.cache.set(cacheKey, stats);
    return stats;
  }

  async getRepositories(limit = 12): Promise<GitHubRepository[]> {
    const username = await this.resolveUsername();
    const cacheKey = this.cacheKey(`repos:${limit}`, username);
    const cached = this.cache.get(cacheKey) as GitHubRepository[] | null;
    if (cached) return cached;

    const repos = await githubClient.get<GitHubRestRepo[]>(
      `/users/${username}/repos?per_page=100&sort=updated`
    );

    const mapped = repos
      .filter((repo) => !repo.private)
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, limit)
      .map(mapRepository);

    this.cache.set(cacheKey, mapped);
    return mapped;
  }

  async getLanguages(limit = 12): Promise<GitHubLanguageStat[]> {
    const username = await this.resolveUsername();
    const cacheKey = this.cacheKey(`languages:${limit}`, username);
    const cached = this.cache.get(cacheKey) as GitHubLanguageStat[] | null;
    if (cached) return cached;

    const repos = await this.getRepositories(limit);
    const languageTotals = new Map<string, number>();

    await Promise.all(
      repos.map(async (repo) => {
        try {
          const languages = await githubClient.get<Record<string, number>>(
            `/repos/${repo.fullName}/languages`
          );

          for (const [language, bytes] of Object.entries(languages)) {
            languageTotals.set(language, (languageTotals.get(language) ?? 0) + bytes);
          }
        } catch {
          // Skip repos where language stats are unavailable.
        }
      })
    );

    const totalBytes = [...languageTotals.values()].reduce((sum, bytes) => sum + bytes, 0);
    const languages: GitHubLanguageStat[] = [...languageTotals.entries()]
      .map(([name, bytes]) => ({
        name,
        bytes,
        percentage: totalBytes > 0 ? Math.round((bytes / totalBytes) * 1000) / 10 : 0,
        color: getLanguageColor(name),
      }))
      .sort((a, b) => b.bytes - a.bytes);

    this.cache.set(cacheKey, languages);
    return languages;
  }

  async getContributions(): Promise<GitHubContributions> {
    const username = await this.resolveUsername();
    const cacheKey = this.cacheKey('contributions', username);
    const cached = this.cache.get(cacheKey) as GitHubContributions | null;
    if (cached) return cached;

    const response = await githubClient.graphql<GitHubGraphQLContributionsResponse>(
      `
        query ($login: String!) {
          user(login: $login) {
            contributionsCollection {
              contributionCalendar {
                totalContributions
                weeks {
                  contributionDays {
                    contributionCount
                    date
                  }
                }
              }
            }
          }
        }
      `,
      { login: username }
    );

    const calendar = response.data.user?.contributionsCollection.contributionCalendar;

    if (!calendar) {
      return { totalContributions: 0, weeks: [] };
    }

    const contributions: GitHubContributions = {
      totalContributions: calendar.totalContributions,
      weeks: calendar.weeks.map((week) =>
        week.contributionDays.map((day) => ({
          date: day.date,
          count: day.contributionCount,
        }))
      ),
    };

    this.cache.set(cacheKey, contributions);
    return contributions;
  }

  async getOverview(): Promise<GitHubOverview> {
    const username = await this.resolveUsername();
    const cacheKey = this.cacheKey('overview', username);
    const cached = this.cache.get(cacheKey) as GitHubOverview | null;
    if (cached) return cached;

    const [stats, repositories, languages, contributions] = await Promise.all([
      this.getStats(),
      this.getRepositories(),
      this.getLanguages(),
      this.getContributions(),
    ]);

    const overview: GitHubOverview = {
      stats,
      repositories,
      languages,
      contributions,
      cachedAt: new Date().toISOString(),
    };

    this.cache.set(cacheKey, overview);
    return overview;
  }
}

function mapRepository(repo: GitHubRestRepo): GitHubRepository {
  return {
    id: repo.id,
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description,
    url: repo.html_url,
    homepage: repo.homepage,
    language: repo.language,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    watchers: repo.watchers_count,
    topics: repo.topics ?? [],
    updatedAt: repo.updated_at,
    pushedAt: repo.pushed_at,
    isFork: repo.fork,
    isPrivate: repo.private,
  };
}

export const githubService = new GitHubService();
