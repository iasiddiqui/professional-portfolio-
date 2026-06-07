'use client';

import Link from 'next/link';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';

import { AdminNavSectionGroup } from '@/features/admin/components/admin-nav-section';
import { useAdminNavigation } from '@/features/admin/hooks/use-admin-navigation';
import { ROUTES } from '@/constants/routes';
import { useUiStore } from '@/store/ui.store';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getInitials } from '@/utils/string';
import { useAuth } from '@/features/auth/providers/auth-provider';

interface AdminSidebarProps {
  collapsed?: boolean;
  onNavigate?: () => void;
  className?: string;
}

export function AdminSidebar({ collapsed = false, onNavigate, className }: AdminSidebarProps) {
  const { sections } = useAdminNavigation();
  const { user } = useAuth();
  const { toggleSidebar, isSidebarOpen } = useUiStore();

  return (
    <aside
      className={cn(
        'flex h-full flex-col border-r bg-card transition-all duration-200',
        collapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      <div
        className={cn(
          'flex shrink-0 items-center border-b',
          collapsed ? 'h-14 justify-center px-2' : 'h-16 justify-between gap-2 px-3'
        )}
      >
        {!collapsed ? (
          <Link href={ROUTES.admin.dashboard} className="min-w-0 truncate text-lg font-semibold" onClick={onNavigate}>
            Portfolio<span className="text-accent">.</span>Admin
          </Link>
        ) : (
          <Link
            href={ROUTES.admin.dashboard}
            className="sr-only"
            onClick={onNavigate}
            aria-label="Admin dashboard"
          >
            Dashboard
          </Link>
        )}

        <Button
          variant="outline"
          size="icon"
          className={cn(
            'shrink-0 bg-background text-muted-foreground hover:text-foreground',
            collapsed ? 'h-9 w-9' : 'h-8 w-8'
          )}
          onClick={toggleSidebar}
          title={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </Button>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto p-4">
        {sections.map((section) => (
          <AdminNavSectionGroup
            key={section.id}
            section={section}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      <div className={cn('border-t p-4', collapsed && 'flex flex-col items-center')}>
        {!collapsed && user ? (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-sm font-medium text-accent-foreground">
              {getInitials(user.name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user.role}</p>
            </div>
          </div>
        ) : collapsed && user ? (
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-sm font-medium text-accent-foreground"
            title={user.name}
          >
            {getInitials(user.name)}
          </div>
        ) : null}
      </div>
    </aside>
  );
}
