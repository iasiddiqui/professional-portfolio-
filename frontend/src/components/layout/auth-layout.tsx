import type { ReactNode } from 'react';

import { FadeIn } from '@/components/animations/fade-in';
import { ThemeToggle } from '@/components/common/theme-toggle';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background p-4">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <FadeIn className="w-full max-w-md">{children}</FadeIn>
    </div>
  );
}
