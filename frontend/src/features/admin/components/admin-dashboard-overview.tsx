'use client';

import { BarChart3, FileText, FolderKanban, Inbox } from 'lucide-react';
import Link from 'next/link';

import { AdminPageHeader } from '@/features/admin/components/admin-page-header';
import { useAdminNavigation } from '@/features/admin/hooks/use-admin-navigation';
import { LeadStatsWidgets } from '@/features/leads/components/lead-stats-widgets';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ROUTES } from '@/constants/routes';
import { MODULE_PERMISSIONS } from '@/constants/permissions';
import { useAuth } from '@/features/auth/providers/auth-provider';
import { SlideUp } from '@/components/animations/slide-up';

const quickLinks = [
  {
    title: 'Projects',
    description: 'Manage portfolio projects',
    href: ROUTES.admin.projects,
    icon: FolderKanban,
    permission: 'projects:read' as const,
  },
  {
    title: 'Blog',
    description: 'Publish articles',
    href: ROUTES.admin.blog,
    icon: FileText,
    permission: 'blog:read' as const,
  },
  {
    title: 'Leads',
    description: 'Review inquiries',
    href: ROUTES.admin.leads,
    icon: Inbox,
    permission: 'leads:read' as const,
  },
  {
    title: 'Analytics',
    description: 'View traffic insights',
    href: ROUTES.admin.analytics,
    icon: BarChart3,
    permission: 'analytics:read' as const,
  },
];

export function AdminDashboardOverview() {
  const { user, hasPermission } = useAuth();
  const { flatItems } = useAdminNavigation();
  const canViewLeads = hasPermission(MODULE_PERMISSIONS.leads.read);

  const accessibleLinks = quickLinks.filter((link) =>
    user?.permissions.includes(link.permission)
  );

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title={`Welcome back${user?.name ? `, ${user.name.split(' ')[0]}` : ''}`}
        description="Overview of your portfolio platform admin dashboard."
        breadcrumbs={[{ label: 'Dashboard' }]}
      />

      {canViewLeads ? (
        <SlideUp>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Lead pipeline</h2>
            <Link href={ROUTES.admin.leads} className="text-sm text-accent hover:underline">
              View all leads
            </Link>
          </div>
          <LeadStatsWidgets compact />
        </SlideUp>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Platform summary</CardTitle>
          <CardDescription>
            {flatItems.length} modules available · {user?.role} role
          </CardDescription>
        </CardHeader>
      </Card>

      {accessibleLinks.length > 0 ? (
        <SlideUp delay={0.1}>
          <h2 className="mb-4 text-lg font-semibold">Quick access</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {accessibleLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link key={link.href} href={link.href}>
                  <Card className="transition-colors hover:border-accent/50 hover:bg-muted/30">
                    <CardHeader>
                      <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                        <Icon className="h-5 w-5 text-accent" />
                      </div>
                      <CardTitle className="text-base">{link.title}</CardTitle>
                      <CardDescription>{link.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              );
            })}
          </div>
        </SlideUp>
      ) : null}
    </div>
  );
}
