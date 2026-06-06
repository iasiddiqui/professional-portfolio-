'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { ThemeToggle } from '@/components/common/theme-toggle';
import { Button } from '@/components/ui/button';
import { publicNavigation } from '@/features/public/config/navigation';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';

interface SiteHeaderProps {
  siteName?: string;
}

export function SiteHeader({ siteName = 'Portfolio' }: SiteHeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const mobileNavId = 'mobile-primary-navigation';

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href={ROUTES.home} className="text-sm font-semibold tracking-tight">
          {siteName}
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {publicNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground',
                pathname === item.href && 'bg-muted/60 text-foreground'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild size="sm" className="hidden md:inline-flex">
            <Link href={ROUTES.contact}>Get in touch</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls={mobileNavId}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-border/60 md:hidden">
          <nav
            id={mobileNavId}
            className="container mx-auto flex flex-col gap-1 px-4 py-4"
            aria-label="Primary"
          >
            {publicNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground',
                  pathname === item.href && 'bg-muted/60 text-foreground'
                )}
              >
                {item.label}
              </Link>
            ))}
            <Button asChild className="mt-2">
              <Link href={ROUTES.contact} onClick={() => setOpen(false)}>
                Get in touch
              </Link>
            </Button>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
