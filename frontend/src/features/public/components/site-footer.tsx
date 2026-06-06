import Link from 'next/link';

import { publicNavigation } from '@/features/public/config/navigation';
import { ROUTES } from '@/constants/routes';

interface SiteFooterProps {
  siteName?: string;
  contactEmail?: string | null;
  socialLinks?: Record<string, string> | null;
}

export function SiteFooter({
  siteName = 'Portfolio',
  contactEmail,
  socialLinks,
}: SiteFooterProps) {
  const socialEntries = socialLinks ? Object.entries(socialLinks) : [];

  return (
    <footer className="border-t border-border/60">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr]">
          <div>
            <Link href={ROUTES.home} className="text-lg font-semibold tracking-tight">
              {siteName}
            </Link>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
              Building thoughtful digital products with clean architecture, polished UX, and
              production-ready engineering.
            </p>
            {contactEmail ? (
              <a
                href={`mailto:${contactEmail}`}
                className="mt-4 inline-block text-sm text-accent hover:underline"
              >
                {contactEmail}
              </a>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Navigate
              </p>
              <ul className="space-y-2">
                {publicNavigation.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {socialEntries.length > 0 ? (
              <div>
                <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  Social
                </p>
                <ul className="space-y-2">
                  {socialEntries.map(([label, href]) => (
                    <li key={label}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm capitalize text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-10 border-t border-border/60 pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {siteName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
