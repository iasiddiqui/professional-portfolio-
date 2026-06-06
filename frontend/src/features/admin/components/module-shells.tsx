'use client';

import type { ReactNode } from 'react';

import { AdminPageHeader } from '@/features/admin/components/admin-page-header';
import { ModuleRoute } from '@/features/admin/components/module-route';
import { MODULE_PERMISSIONS } from '@/constants/permissions';
import { ROUTES } from '@/constants/routes';
import type { Permission } from '@/constants/permissions';
import type { AdminBreadcrumb } from '@/types/admin.types';

interface ModuleShellProps {
  children: ReactNode;
  title: string;
  description: string;
  moduleName: string;
  permissions: Permission | Permission[];
  breadcrumbs?: AdminBreadcrumb[];
  actions?: ReactNode;
}

function ModuleShell({
  children,
  title,
  description,
  moduleName,
  permissions,
  breadcrumbs,
  actions,
}: ModuleShellProps) {
  return (
    <ModuleRoute permissions={permissions} moduleName={moduleName}>
      <AdminPageHeader
        title={title}
        description={description}
        breadcrumbs={breadcrumbs}
        actions={actions}
      />
      {children}
    </ModuleRoute>
  );
}

// ─── Projects ────────────────────────────────────────────────────────────────

export function ProjectModuleShell({
  children,
  title = 'Projects',
  description = 'Manage portfolio projects, tech stack, and publication status.',
  breadcrumbs,
  actions,
}: Partial<Omit<ModuleShellProps, 'permissions' | 'moduleName'>> & { children: ReactNode }) {
  return (
    <ModuleShell
      title={title}
      description={description}
      moduleName="Projects"
      permissions={MODULE_PERMISSIONS.projects.read}
      breadcrumbs={breadcrumbs ?? [{ label: 'Dashboard', href: ROUTES.admin.dashboard }, { label: 'Projects' }]}
      actions={actions}
    >
      {children}
    </ModuleShell>
  );
}

// ─── Blog ────────────────────────────────────────────────────────────────────

export function BlogModuleShell({
  children,
  title = 'Blog',
  description = 'Create and publish blog posts with SEO metadata.',
  breadcrumbs,
  actions,
}: Partial<Omit<ModuleShellProps, 'permissions' | 'moduleName'>> & { children: ReactNode }) {
  return (
    <ModuleShell
      title={title}
      description={description}
      moduleName="Blog"
      permissions={MODULE_PERMISSIONS.blog.read}
      breadcrumbs={breadcrumbs ?? [{ label: 'Dashboard', href: ROUTES.admin.dashboard }, { label: 'Blog' }]}
      actions={actions}
    >
      {children}
    </ModuleShell>
  );
}

// ─── Leads ───────────────────────────────────────────────────────────────────

export function LeadModuleShell({
  children,
  title = 'Leads',
  description = 'Review and manage inbound contact and project inquiries.',
  breadcrumbs,
  actions,
}: Partial<Omit<ModuleShellProps, 'permissions' | 'moduleName'>> & { children: ReactNode }) {
  return (
    <ModuleShell
      title={title}
      description={description}
      moduleName="Leads"
      permissions={MODULE_PERMISSIONS.leads.read}
      breadcrumbs={breadcrumbs ?? [{ label: 'Dashboard', href: ROUTES.admin.dashboard }, { label: 'Leads' }]}
      actions={actions}
    >
      {children}
    </ModuleShell>
  );
}

// ─── Analytics ───────────────────────────────────────────────────────────────

export function AnalyticsModuleShell({
  children,
  title = 'Analytics',
  description = 'Track visits, page views, contact requests, and downloads.',
  breadcrumbs,
  actions,
}: Partial<Omit<ModuleShellProps, 'permissions' | 'moduleName'>> & { children: ReactNode }) {
  return (
    <ModuleShell
      title={title}
      description={description}
      moduleName="Analytics"
      permissions={MODULE_PERMISSIONS.analytics.read}
      breadcrumbs={breadcrumbs ?? [{ label: 'Dashboard', href: ROUTES.admin.dashboard }, { label: 'Analytics' }]}
      actions={actions}
    >
      {children}
    </ModuleShell>
  );
}

// ─── Testimonials ────────────────────────────────────────────────────────────

export function TestimonialModuleShell({
  children,
  title = 'Testimonials',
  description = 'Manage client testimonials and featured reviews.',
  breadcrumbs,
  actions,
}: Partial<Omit<ModuleShellProps, 'permissions' | 'moduleName'>> & { children: ReactNode }) {
  return (
    <ModuleShell
      title={title}
      description={description}
      moduleName="Testimonials"
      permissions={MODULE_PERMISSIONS.testimonials.read}
      breadcrumbs={
        breadcrumbs ?? [{ label: 'Dashboard', href: ROUTES.admin.dashboard }, { label: 'Testimonials' }]
      }
      actions={actions}
    >
      {children}
    </ModuleShell>
  );
}

// ─── Resume ──────────────────────────────────────────────────────────────────

export function ResumeModuleShell({
  children,
  title = 'Resume',
  description = 'Upload and manage resume versions for public download.',
  breadcrumbs,
  actions,
}: Partial<Omit<ModuleShellProps, 'permissions' | 'moduleName'>> & { children: ReactNode }) {
  return (
    <ModuleShell
      title={title}
      description={description}
      moduleName="Resume"
      permissions={MODULE_PERMISSIONS.resume.read}
      breadcrumbs={breadcrumbs ?? [{ label: 'Dashboard', href: ROUTES.admin.dashboard }, { label: 'Resume' }]}
      actions={actions}
    >
      {children}
    </ModuleShell>
  );
}

// ─── Knowledge Base ──────────────────────────────────────────────────────────

export function KnowledgeBaseModuleShell({
  children,
  title = 'Knowledge Base',
  description = 'Maintain AI knowledge entries used by Ask Ishan.',
  breadcrumbs,
  actions,
}: Partial<Omit<ModuleShellProps, 'permissions' | 'moduleName'>> & { children: ReactNode }) {
  return (
    <ModuleShell
      title={title}
      description={description}
      moduleName="Knowledge Base"
      permissions={MODULE_PERMISSIONS.knowledgeBase.read}
      breadcrumbs={
        breadcrumbs ?? [{ label: 'Dashboard', href: ROUTES.admin.dashboard }, { label: 'Knowledge Base' }]
      }
      actions={actions}
    >
      {children}
    </ModuleShell>
  );
}

// ─── Settings ────────────────────────────────────────────────────────────────

export function SettingsModuleShell({
  children,
  title = 'Settings',
  description = 'Configure site-wide settings, SEO defaults, and maintenance mode.',
  breadcrumbs,
  actions,
}: Partial<Omit<ModuleShellProps, 'permissions' | 'moduleName'>> & { children: ReactNode }) {
  return (
    <ModuleShell
      title={title}
      description={description}
      moduleName="Settings"
      permissions={MODULE_PERMISSIONS.settings.read}
      breadcrumbs={breadcrumbs ?? [{ label: 'Dashboard', href: ROUTES.admin.dashboard }, { label: 'Settings' }]}
      actions={actions}
    >
      {children}
    </ModuleShell>
  );
}
