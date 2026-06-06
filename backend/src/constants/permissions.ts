import { RoleName } from '@prisma/client';

export const PERMISSIONS = {
  // Users
  USERS_READ: 'users:read',
  USERS_WRITE: 'users:write',
  USERS_DELETE: 'users:delete',

  // Projects
  PROJECTS_READ: 'projects:read',
  PROJECTS_WRITE: 'projects:write',
  PROJECTS_DELETE: 'projects:delete',
  PROJECTS_PUBLISH: 'projects:publish',

  // Blog
  BLOG_READ: 'blog:read',
  BLOG_WRITE: 'blog:write',
  BLOG_DELETE: 'blog:delete',
  BLOG_PUBLISH: 'blog:publish',

  // Leads
  LEADS_READ: 'leads:read',
  LEADS_WRITE: 'leads:write',

  // Testimonials
  TESTIMONIALS_READ: 'testimonials:read',
  TESTIMONIALS_WRITE: 'testimonials:write',

  // Resume
  RESUME_READ: 'resume:read',
  RESUME_WRITE: 'resume:write',

  // Knowledge base
  KNOWLEDGE_BASE_READ: 'knowledge_base:read',
  KNOWLEDGE_BASE_WRITE: 'knowledge_base:write',

  // Media
  MEDIA_READ: 'media:read',
  MEDIA_WRITE: 'media:write',
  MEDIA_DELETE: 'media:delete',

  // Analytics
  ANALYTICS_READ: 'analytics:read',

  // Settings
  SETTINGS_READ: 'settings:read',
  SETTINGS_WRITE: 'settings:write',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ALL_PERMISSIONS: Permission[] = Object.values(PERMISSIONS);

export const ROLE_PERMISSIONS: Record<RoleName, Permission[]> = {
  ADMIN: ALL_PERMISSIONS,

  EDITOR: [
    PERMISSIONS.PROJECTS_READ,
    PERMISSIONS.PROJECTS_WRITE,
    PERMISSIONS.PROJECTS_PUBLISH,
    PERMISSIONS.BLOG_READ,
    PERMISSIONS.BLOG_WRITE,
    PERMISSIONS.BLOG_PUBLISH,
    PERMISSIONS.LEADS_READ,
    PERMISSIONS.LEADS_WRITE,
    PERMISSIONS.TESTIMONIALS_READ,
    PERMISSIONS.TESTIMONIALS_WRITE,
    PERMISSIONS.RESUME_READ,
    PERMISSIONS.RESUME_WRITE,
    PERMISSIONS.KNOWLEDGE_BASE_READ,
    PERMISSIONS.KNOWLEDGE_BASE_WRITE,
    PERMISSIONS.MEDIA_READ,
    PERMISSIONS.MEDIA_WRITE,
    PERMISSIONS.ANALYTICS_READ,
    PERMISSIONS.SETTINGS_READ,
  ],

  USER: [
    PERMISSIONS.PROJECTS_READ,
    PERMISSIONS.BLOG_READ,
    PERMISSIONS.TESTIMONIALS_READ,
    PERMISSIONS.RESUME_READ,
    PERMISSIONS.MEDIA_READ,
  ],
};

export const ROLE_LABELS: Record<RoleName, string> = {
  ADMIN: 'Administrator',
  EDITOR: 'Editor',
  USER: 'User',
};

export function hasPermission(
  userPermissions: string[],
  required: Permission | Permission[]
): boolean {
  const requiredList = Array.isArray(required) ? required : [required];
  return requiredList.every((permission) => userPermissions.includes(permission));
}

export function hasAnyPermission(
  userPermissions: string[],
  required: Permission[]
): boolean {
  return required.some((permission) => userPermissions.includes(permission));
}

export function hasRole(userRole: RoleName, allowed: RoleName | RoleName[]): boolean {
  const allowedList = Array.isArray(allowed) ? allowed : [allowed];
  return allowedList.includes(userRole);
}
