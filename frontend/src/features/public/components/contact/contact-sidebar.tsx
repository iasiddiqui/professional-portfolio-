import { Clock, Globe, Linkedin, Mail, MapPin } from 'lucide-react';

interface ContactSidebarProps {
  contactEmail?: string | null;
  socialLinks?: Record<string, string> | null;
}

function formatSocialLabel(key: string): string {
  if (key === 'github') return 'GitHub';
  if (key === 'linkedin') return 'LinkedIn';
  return key.charAt(0).toUpperCase() + key.slice(1);
}

export function ContactSidebar({ contactEmail, socialLinks }: ContactSidebarProps) {
  const socialEntries = socialLinks ? Object.entries(socialLinks) : [];

  return (
    <aside className="space-y-5 lg:sticky lg:top-24">
      <div className="glass-panel relative overflow-hidden rounded-2xl p-6">
        <div className="pointer-events-none absolute inset-0 linear-glow opacity-40" aria-hidden />
        <div className="relative">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Direct contact
          </p>
          <h2 className="mt-2 text-lg font-semibold tracking-tight">Reach out anytime</h2>

          <ul className="mt-6 space-y-5">
            {contactEmail ? (
              <li>
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/30">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Email</p>
                    <a
                      href={`mailto:${contactEmail}`}
                      className="mt-1 block break-all text-sm font-medium transition-colors hover:text-foreground/80"
                    >
                      {contactEmail}
                    </a>
                  </div>
                </div>
              </li>
            ) : null}

            <li>
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/30">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </span>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Location</p>
                  <p className="mt-1 text-sm font-medium">Hyderabad, India · Remote</p>
                </div>
              </div>
            </li>

            <li>
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/30">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                </span>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Availability</p>
                  <p className="mt-1 text-sm font-medium">Contract & full-time · Worldwide</p>
                </div>
              </div>
            </li>

            <li>
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/30">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </span>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Response time</p>
                  <p className="mt-1 text-sm font-medium">Within one business day</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {socialEntries.length > 0 ? (
        <div className="glass-panel rounded-2xl p-6">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Social</p>
          <ul className="mt-4 space-y-2">
            {socialEntries.map(([key, url]) => (
              <li key={key}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {key === 'linkedin' ? <Linkedin className="h-4 w-4" /> : null}
                  {formatSocialLabel(key)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="rounded-2xl border border-border/60 bg-muted/20 p-5 text-sm leading-relaxed text-muted-foreground">
        Typical engagements include product builds, platform modernization, admin dashboards, and
        full-stack delivery with a focus on maintainable architecture.
      </div>
    </aside>
  );
}
