export const PERMISSIONS = {
  USERS_READ: 'users:read',
  USERS_WRITE: 'users:write',
  USERS_DELETE: 'users:delete',

  PROJECTS_READ: 'projects:read',
  PROJECTS_WRITE: 'projects:write',
  PROJECTS_DELETE: 'projects:delete',
  PROJECTS_PUBLISH: 'projects:publish',

  BLOG_READ: 'blog:read',
  BLOG_WRITE: 'blog:write',
  BLOG_DELETE: 'blog:delete',
  BLOG_PUBLISH: 'blog:publish',

  LEADS_READ: 'leads:read',
  LEADS_WRITE: 'leads:write',

  TESTIMONIALS_READ: 'testimonials:read',
  TESTIMONIALS_WRITE: 'testimonials:write',

  RESUME_READ: 'resume:read',
  RESUME_WRITE: 'resume:write',

  KNOWLEDGE_BASE_READ: 'knowledge_base:read',
  KNOWLEDGE_BASE_WRITE: 'knowledge_base:write',

  MEDIA_READ: 'media:read',
  MEDIA_WRITE: 'media:write',
  MEDIA_DELETE: 'media:delete',

  ANALYTICS_READ: 'analytics:read',

  SETTINGS_READ: 'settings:read',
  SETTINGS_WRITE: 'settings:write',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const MODULE_PERMISSIONS = {
  projects: {
    read: PERMISSIONS.PROJECTS_READ,
    write: PERMISSIONS.PROJECTS_WRITE,
    delete: PERMISSIONS.PROJECTS_DELETE,
    publish: PERMISSIONS.PROJECTS_PUBLISH,
  },
  blog: {
    read: PERMISSIONS.BLOG_READ,
    write: PERMISSIONS.BLOG_WRITE,
    delete: PERMISSIONS.BLOG_DELETE,
    publish: PERMISSIONS.BLOG_PUBLISH,
  },
  leads: {
    read: PERMISSIONS.LEADS_READ,
    write: PERMISSIONS.LEADS_WRITE,
  },
  analytics: {
    read: PERMISSIONS.ANALYTICS_READ,
  },
  testimonials: {
    read: PERMISSIONS.TESTIMONIALS_READ,
    write: PERMISSIONS.TESTIMONIALS_WRITE,
  },
  resume: {
    read: PERMISSIONS.RESUME_READ,
    write: PERMISSIONS.RESUME_WRITE,
  },
  knowledgeBase: {
    read: PERMISSIONS.KNOWLEDGE_BASE_READ,
    write: PERMISSIONS.KNOWLEDGE_BASE_WRITE,
  },
  settings: {
    read: PERMISSIONS.SETTINGS_READ,
    write: PERMISSIONS.SETTINGS_WRITE,
  },
} as const;
