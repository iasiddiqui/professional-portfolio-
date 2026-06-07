export const ROUTES = {
  home: '/',
  about: '/about',
  projects: '/projects',
  project: (slug: string) => `/projects/${slug}`,
  services: '/services',
  blog: '/blog',
  blogPost: (slug: string) => `/blog/${slug}`,
  resume: '/resume',
  contact: '/contact',
  hireMe: '/hire-me',
  consultation: '/consultation',
  askIshan: '/ask-ishan',
  login: '/login',
  register: '/register',
  admin: {
    dashboard: '/dashboard',
    projects: '/admin/projects',
    project: (id: string) => `/admin/projects/${id}`,
    projectEdit: (id: string) => `/admin/projects/${id}/edit`,
    projectNew: '/admin/projects/new',
    blog: '/admin/blog',
    blogPost: (id: string) => `/admin/blog/${id}`,
    blogEdit: (id: string) => `/admin/blog/${id}/edit`,
    blogNew: '/admin/blog/new',
    blogCategories: '/admin/blog/categories',
    blogTags: '/admin/blog/tags',
    testimonials: '/admin/testimonials',
    resume: '/admin/resume',
    knowledgeBase: '/admin/knowledge-base',
    about: '/admin/about',
    leads: '/leads',
    lead: (id: string) => `/leads/${id}`,
    analytics: '/analytics',
    settings: '/settings',
  },
} as const;

/** @deprecated Use ROUTES.admin.dashboard */
export const dashboard = ROUTES.admin.dashboard;

export const PUBLIC_ROUTES = [
  ROUTES.home,
  ROUTES.about,
  ROUTES.projects,
  ROUTES.services,
  ROUTES.blog,
  ROUTES.resume,
  ROUTES.contact,
  ROUTES.hireMe,
  ROUTES.consultation,
  ROUTES.askIshan,
  ROUTES.login,
  ROUTES.register,
] as const;

export const AUTH_ROUTES = [ROUTES.login, ROUTES.register] as const;

export const PROTECTED_ROUTES = [
  ROUTES.admin.dashboard,
  ROUTES.admin.projects,
  ROUTES.admin.blog,
  ROUTES.admin.testimonials,
  ROUTES.admin.resume,
  ROUTES.admin.knowledgeBase,
  ROUTES.admin.about,
  ROUTES.admin.leads,
  ROUTES.admin.analytics,
  ROUTES.admin.settings,
] as const;

export const ADMIN_ROUTE_PREFIXES = [
  '/dashboard',
  '/admin',
  '/leads',
  '/analytics',
  '/settings',
] as const;
