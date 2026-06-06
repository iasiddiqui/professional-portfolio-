'use client';

import type { ReactNode } from 'react';

import { AdminShell } from '@/features/admin/components/admin-shell';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return <AdminShell>{children}</AdminShell>;
}
