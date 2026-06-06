import { env, requireEnvValue } from '../../config/env.js';
import { HTTP_STATUS } from '../../constants/http-status.js';
import { AppError } from '../../utils/app-error.js';
import { logger } from '../../utils/logger.js';

const GITHUB_REST_BASE = 'https://api.github.com';
const GITHUB_GRAPHQL_URL = 'https://api.github.com/graphql';

interface GitHubRequestOptions {
  method?: 'GET' | 'POST';
  body?: unknown;
  graphql?: boolean;
}

export class GitHubClient {
  private getHeaders(): Record<string, string> {
    return {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${requireEnvValue(env.GITHUB_TOKEN, 'GITHUB_TOKEN')}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'portfolio-platform',
    };
  }

  async request<T>(path: string, options: GitHubRequestOptions = {}): Promise<T> {
    if (!env.GITHUB_TOKEN) {
      throw new AppError('GitHub integration is not configured', HTTP_STATUS.SERVICE_UNAVAILABLE);
    }

    const url = options.graphql ? GITHUB_GRAPHQL_URL : `${GITHUB_REST_BASE}${path}`;

    const response = await fetch(url, {
      method: options.method ?? (options.graphql ? 'POST' : 'GET'),
      headers: {
        ...this.getHeaders(),
        ...(options.graphql || options.body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      const message = await response.text().catch(() => 'GitHub API request failed');
      logger.error('GitHub API error', { path, status: response.status, message });
      throw new AppError(
        'GitHub API request failed',
        response.status >= 500
          ? HTTP_STATUS.INTERNAL_SERVER_ERROR
          : HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }

    return response.json() as Promise<T>;
  }

  get<T>(path: string): Promise<T> {
    return this.request<T>(path);
  }

  graphql<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
    return this.request<T>('', { graphql: true, body: { query, variables } });
  }
}

export const githubClient = new GitHubClient();
