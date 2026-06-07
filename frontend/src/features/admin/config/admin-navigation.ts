import {
  BarChart3,
  BookOpen,
  FileText,
  FolderKanban,
  Inbox,
  LayoutDashboard,
  MessageSquareQuote,
  Settings,
  Star,
  UserRound,
} from 'lucide-react';

import { MODULE_PERMISSIONS, PERMISSIONS } from '@/constants/permissions';
import { ROUTES } from '@/constants/routes';
import type { AdminModuleMeta, AdminNavSection } from '@/types/admin.types';

export const adminNavigation: AdminNavSection[] = [
  {
    id: 'overview',
    title: 'Overview',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        href: ROUTES.admin.dashboard,
        icon: LayoutDashboard,
      },
    ],
  },
  {
    id: 'content',
    title: 'Content',
    items: [
      {
        id: 'projects',
        label: 'Projects',
        href: ROUTES.admin.projects,
        icon: FolderKanban,
        permissions: MODULE_PERMISSIONS.projects.read,
      },
      {
        id: 'blog',
        label: 'Blog',
        href: ROUTES.admin.blog,
        icon: FileText,
        permissions: MODULE_PERMISSIONS.blog.read,
      },
      {
        id: 'testimonials',
        label: 'Testimonials',
        href: ROUTES.admin.testimonials,
        icon: MessageSquareQuote,
        permissions: MODULE_PERMISSIONS.testimonials.read,
      },
      {
        id: 'resume',
        label: 'Resume',
        href: ROUTES.admin.resume,
        icon: Star,
        permissions: MODULE_PERMISSIONS.resume.read,
      },
      {
        id: 'about',
        label: 'About',
        href: ROUTES.admin.about,
        icon: UserRound,
        permissions: MODULE_PERMISSIONS.knowledgeBase.read,
      },
      {
        id: 'knowledge-base',
        label: 'Knowledge Base',
        href: ROUTES.admin.knowledgeBase,
        icon: BookOpen,
        permissions: MODULE_PERMISSIONS.knowledgeBase.read,
      },
    ],
  },
  {
    id: 'crm',
    title: 'CRM',
    items: [
      {
        id: 'leads',
        label: 'Leads',
        href: ROUTES.admin.leads,
        icon: Inbox,
        permissions: MODULE_PERMISSIONS.leads.read,
      },
    ],
  },
  {
    id: 'insights',
    title: 'Insights',
    items: [
      {
        id: 'analytics',
        label: 'Analytics',
        href: ROUTES.admin.analytics,
        icon: BarChart3,
        permissions: MODULE_PERMISSIONS.analytics.read,
      },
    ],
  },
  {
    id: 'system',
    title: 'System',
    items: [
      {
        id: 'settings',
        label: 'Settings',
        href: ROUTES.admin.settings,
        icon: Settings,
        permissions: PERMISSIONS.SETTINGS_READ,
        roles: 'ADMIN',
      },
    ],
  },
];

export const adminModules: Record<string, AdminModuleMeta> = {
  projects: {
    id: 'projects',
    title: 'Projects',
    description: 'Manage portfolio projects, tech stack, and publication status.',
    permissions: MODULE_PERMISSIONS.projects.read,
  },
  blog: {
    id: 'blog',
    title: 'Blog',
    description: 'Create and publish blog posts with SEO metadata.',
    permissions: MODULE_PERMISSIONS.blog.read,
  },
  testimonials: {
    id: 'testimonials',
    title: 'Testimonials',
    description: 'Manage client testimonials and featured reviews.',
    permissions: MODULE_PERMISSIONS.testimonials.read,
  },
  resume: {
    id: 'resume',
    title: 'Resume',
    description: 'Upload and manage resume versions for public download.',
    permissions: MODULE_PERMISSIONS.resume.read,
  },
  knowledgeBase: {
    id: 'knowledge-base',
    title: 'Knowledge Base',
    description: 'Maintain AI knowledge entries used by Ask Ishan.',
    permissions: MODULE_PERMISSIONS.knowledgeBase.read,
  },
  about: {
    id: 'about',
    title: 'About',
    description: 'Edit your public About page — intro, experience, education, and other sections.',
    permissions: MODULE_PERMISSIONS.knowledgeBase.read,
  },
  leads: {
    id: 'leads',
    title: 'Leads',
    description: 'Review and manage inbound contact and project inquiries.',
    permissions: MODULE_PERMISSIONS.leads.read,
  },
  analytics: {
    id: 'analytics',
    title: 'Analytics',
    description: 'Track visits, page views, contact requests, and downloads.',
    permissions: MODULE_PERMISSIONS.analytics.read,
  },
};
