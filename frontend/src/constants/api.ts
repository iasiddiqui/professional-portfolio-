const SERVER_API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

/** Browser requests use same-origin proxy so httpOnly auth cookies work. */
export const API_BASE_URL =
  typeof window === 'undefined' ? SERVER_API_URL : '/api/proxy/v1';

export const SERVER_API_BASE_URL = SERVER_API_URL;
export const API_ORIGIN = SERVER_API_URL.replace(/\/api\/v1\/?$/, '');
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

export const API_TIMEOUT = 30_000;

export const AUTH_ENDPOINTS = {
  register: '/auth/register',
  login: '/auth/login',
  refresh: '/auth/refresh-token',
  logout: '/auth/logout',
  logoutAll: '/auth/logout-all',
  me: '/auth/me',
  changePassword: '/auth/change-password',
} as const;

export const API_ENDPOINTS = {
  projects: '/projects',
  blog: '/blog',
  blogCategories: '/blog/categories',
  tags: '/tags',
  leads: '/leads',
  testimonials: '/testimonials',
  resume: '/resume',
  knowledgeBase: '/knowledge-base',
  analytics: '/analytics',
  settings: '/settings',
  public: {
    site: '/public/site',
    about: '/public/about',
    services: '/public/services',
    testimonials: '/public/testimonials',
    resume: '/public/resume',
    projects: '/public/projects',
    project: (slug: string) => `/public/projects/${slug}`,
    blog: '/public/blog',
    blogPost: (slug: string) => `/public/blog/${slug}`,
    contact: '/public/contact',
    ai: {
      ask: '/public/ai/ask',
    },
    github: {
      overview: '/public/github',
      stats: '/public/github/stats',
      repos: '/public/github/repos',
      languages: '/public/github/languages',
      contributions: '/public/github/contributions',
    },
  },
  media: {
    upload: '/media/upload',
    delete: (id: string) => `/media/${id}`,
  },
} as const;
