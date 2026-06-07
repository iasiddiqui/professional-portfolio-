import { Download, ExternalLink } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { PublicResume } from '@/features/public/types/public.types';
import { resolveResumeFileName } from '@/lib/file-url';
import { getPdfEmbedUrl, isPdfUrl } from '@/lib/pdf-url';
import { formatDate } from '@/utils/date';

interface ResumeViewerProps {
  resume: PublicResume;
  fileUrl: string;
}

export function ResumeViewer({ resume, fileUrl }: ResumeViewerProps) {
  const embedUrl = getPdfEmbedUrl(fileUrl, resume.fileName);
  const showPdfPreview = isPdfUrl(fileUrl);
  const downloadName = resolveResumeFileName(resume.fileName, fileUrl);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-gradient">{resume.title}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Version {resume.version} · Updated {formatDate(resume.updatedAt)}
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <a href={fileUrl} target="_blank" rel="noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Open in new tab
            </a>
          </Button>
          <Button asChild size="sm">
            <a href={fileUrl} download={downloadName} rel="noreferrer">
              <Download className="mr-2 h-4 w-4" />
              Download
            </a>
          </Button>
        </div>
      </div>

      {showPdfPreview ? (
        <div className="overflow-hidden rounded-xl border border-border/60 bg-muted/10">
          <iframe
            src={embedUrl}
            title={`${resume.title} preview`}
            className="h-[min(80vh,900px)] w-full bg-background"
          />
        </div>
      ) : (
        <div className="rounded-xl border border-border/60 bg-muted/10 p-8 text-center text-sm text-muted-foreground">
          <p>Preview is not available for this file type.</p>
          <p className="mt-2">Use Open or Download above to view the document.</p>
        </div>
      )}
    </div>
  );
}
