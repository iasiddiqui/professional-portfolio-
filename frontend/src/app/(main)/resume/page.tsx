import type { Metadata } from 'next';
import Link from 'next/link';
import { FileText } from 'lucide-react';

import { JsonLd } from '@/components/seo/json-ld';
import { Button } from '@/components/ui/button';
import { PageHero } from '@/features/public/components/page-hero';
import { ResumeViewer } from '@/features/public/components/resume/resume-viewer';
import { ROUTES } from '@/constants/routes';
import { buildBreadcrumbSchema } from '@/lib/seo/json-ld';
import { createStaticPageMetadata } from '@/lib/seo/page-metadata';
import { publicApi } from '@/lib/public-api';
import { resolveMediaUrl } from '@/lib/media-url';

export async function generateMetadata(): Promise<Metadata> {
  return createStaticPageMetadata(
    ROUTES.resume,
    'Resume',
    'View and download resume and professional background.'
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
        title="Experience on paper"
        description="A concise overview of skills, experience, and the kind of work I take on."
      />

      <section className="container mx-auto px-4 pb-24">
        <div className="glass-panel w-full rounded-2xl p-6 sm:p-8 lg:p-10">
          {resume && fileUrl ? (
            <ResumeViewer resume={resume} fileUrl={fileUrl} />
          ) : (
            <div className="text-center text-sm text-muted-foreground">
              <FileText className="mx-auto mb-4 h-8 w-8 text-muted-foreground" />
              <p>No active resume is available yet.</p>
              <p className="mt-2">Upload and activate a resume in the admin CMS to enable viewing.</p>
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
