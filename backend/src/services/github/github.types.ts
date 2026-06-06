export interface GitHubUserStats {
  username: string;
  name: string | null;
  bio: string | null;
  avatarUrl: string;
  profileUrl: string;
  location: string | null;
  publicRepos: number;
  followers: number;
  following: number;
  totalStars: number;
  totalForks: number;
}

export interface GitHubRepository {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  url: string;
  homepage: string | null;
  language: string | null;
  stars: number;
  forks: number;
  watchers: number;
  topics: string[];
  updatedAt: string;
  pushedAt: string | null;
  isFork: boolean;
  isPrivate: boolean;
}

export interface GitHubLanguageStat {
  name: string;
  bytes: number;
  percentage: number;
  color: string | null;
}

export interface GitHubContributionDay {
  date: string;
  count: number;
}

export interface GitHubContributions {
  totalContributions: number;
  weeks: GitHubContributionDay[][];
}

export interface GitHubOverview {
  stats: GitHubUserStats;
  repositories: GitHubRepository[];
  languages: GitHubLanguageStat[];
  contributions: GitHubContributions;
  cachedAt: string;
}
