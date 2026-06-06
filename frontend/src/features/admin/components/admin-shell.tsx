'use client';

import type { ReactNode } from 'react';

import { PageTransition } from '@/components/animations/page-transition';
import { AdminHeader } from '@/features/admin/components/admin-header';
import { AdminMobileNav } from '@/features/admin/components/admin-mobile-nav';
import { AdminSidebar } from '@/features/admin/components/admin-sidebar';
import { ProtectedRoute } from '@/features/auth/components/auth-guards';
import { useUiStore } from '@/store/ui.store';
import { cn } from '@/lib/utils';

interface AdminShellProps {
  children: ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const { isSidebarOpen } = useUiStore();

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-background">
        <div className="hidden md:block">
          <AdminSidebar collapsed={!isSidebarOpen} className="sticky top-0 h-screen" />
        </div>

        <AdminMobileNav />

        <div className="flex min-h-screen flex-1 flex-col">
          <AdminHeader />
          <main className={cn('flex-1 p-4 md:p-6 lg:p-8')}>
            <PageTransition>{children}</PageTransition>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
