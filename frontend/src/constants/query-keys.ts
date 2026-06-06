export const QUERY_KEYS = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  projects: {
    all: ['projects'] as const,
    list: (params?: unknown) => ['projects', 'list', params] as const,
    detail: (id: string) => ['projects', 'detail', id] as const,
  },
  blog: {
    all: ['blog'] as const,
    list: (params?: unknown) => ['blog', 'list', params] as const,
    detail: (id: string) => ['blog', 'detail', id] as const,
    categories: {
      all: ['blog', 'categories'] as const,
    },
    tags: {
      all: ['tags'] as const,
    },
  },
  leads: {
    all: ['leads'] as const,
    stats: ['leads', 'stats'] as const,
    list: (params?: unknown) => ['leads', 'list', params] as const,
    detail: (id: string) => ['leads', 'detail', id] as const,
  },
  analytics: {
    all: ['analytics'] as const,
    overview: (range?: string) => ['analytics', 'overview', range] as const,
  },
  testimonials: {
    all: ['testimonials'] as const,
    list: (params?: unknown) => ['testimonials', 'list', params] as const,
    detail: (id: string) => ['testimonials', 'detail', id] as const,
  },
  resume: {
    all: ['resume'] as const,
    list: (params?: unknown) => ['resume', 'list', params] as const,
    detail: (id: string) => ['resume', 'detail', id] as const,
  },
  knowledgeBase: {
    all: ['knowledge-base'] as const,
    list: (params?: unknown) => ['knowledge-base', 'list', params] as const,
    detail: (id: string) => ['knowledge-base', 'detail', id] as const,
    categories: ['knowledge-base', 'categories'] as const,
  },
  settings: {
    all: ['settings'] as const,
    detail: ['settings', 'detail'] as const,
  },
} as const;

export const QUERY_STALE_TIME = {
  short: 30 * 1000,
  default: 5 * 60 * 1000,
  long: 30 * 60 * 1000,
} as const;

export const QUERY_GC_TIME = {
  default: 10 * 60 * 1000,
} as const;
