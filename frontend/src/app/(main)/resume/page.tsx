import type { Metadata } from 'next';
import Link from 'next/link';
import { Download, FileText } from 'lucide-react';

import { JsonLd } from '@/components/seo/json-ld';
import { Button } from '@/components/ui/button';
import { PageHero } from '@/features/public/components/page-hero';
import { ROUTES } from '@/constants/routes';
import { buildBreadcrumbSchema } from '@/lib/seo/json-ld';
import { createStaticPageMetadata } from '@/lib/seo/page-metadata';
import { publicApi } from '@/lib/public-api';
import { resolveMediaUrl } from '@/lib/media-url';
import { formatDate } from '@/utils/date';

export async function generateMetadata(): Promise<Metadata> {
  return createStaticPageMetadata(
    ROUTES.resume,
    'Resume',
    'Download resume and professional background.'
  );
}

export default async function ResumePage() {
  let resume = null;

  try {
    resume = await publicApi.getResume();
  } catch {
    // Resume may be unavailable during build or when CMS content is not seeded yet.
  }

  const fileUrl = resume ? resolveMediaUrl(resume.fileUrl) : null;

  return (
    <>
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: 'Home', path: ROUTES.home },
          { name: 'Resume', path: ROUTES.resume },
        ])}
      />
      <PageHero
        eyebrow="Resume"
        title="Experience on paper"
        description="A concise overview of skills, experience, and the kind of work I take on."
      />

      <section className="container mx-auto px-4 pb-24">
        <div className="glass-panel mx-auto max-w-2xl rounded-2xl p-8 sm:p-10">
          {resume && fileUrl ? (
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-border/60 bg-muted/30">
                <FileText className="h-7 w-7 text-accent" />
              </div>
              <h2 className="text-2xl font-semibold tracking-tight">{resume.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Version {resume.version} · Updated {formatDate(resume.updatedAt)}
              </p>
              <Button asChild size="lg" className="mt-8">
                <a href={fileUrl} target="_blank" rel="noreferrer" download>
                  <Download className="mr-2 h-4 w-4" />
                  Download resume
                </a>
              </Button>
            </div>
          ) : (
            <div className="text-center text-sm text-muted-foreground">
              <FileText className="mx-auto mb-4 h-8 w-8 text-muted-foreground" />
              <p>No active resume is available yet.</p>
              <p className="mt-2">Upload and activate a resume in the admin CMS to enable downloads.</p>
              <Button asChild variant="outline" className="mt-6">
                <Link href={ROUTES.contact}>Contact me instead</Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
