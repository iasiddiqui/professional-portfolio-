import { API_BASE_URL, API_ENDPOINTS } from '@/constants/api';
import type { GitHubOverview } from '@/features/github/types/github.types';

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
}

async function githubFetch<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { Accept: 'application/json' },
    next: { revalidate: 900 },
  });

  const json = (await response.json()) as ApiEnvelope<T>;

  if (!response.ok || !json.success) {
    throw new Error(json.message ?? `GitHub request failed (${response.status})`);
  }

  return json.data;
}

export const githubApi = {
  getOverview: () => githubFetch<GitHubOverview>(API_ENDPOINTS.public.github.overview),
  getStats: () => githubFetch<GitHubOverview['stats']>(API_ENDPOINTS.public.github.stats),
  getRepositories: () =>
    githubFetch<GitHubOverview['repositories']>(API_ENDPOINTS.public.github.repos),
  getLanguages: () => githubFetch<GitHubOverview['languages']>(API_ENDPOINTS.public.github.languages),
  getContributions: () =>
    githubFetch<GitHubOverview['contributions']>(API_ENDPOINTS.public.github.contributions),
};
