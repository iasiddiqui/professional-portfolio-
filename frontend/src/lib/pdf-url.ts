const PDF_VIEWER_HASH = '#toolbar=1&navpanes=0&view=FitH';

function isSameOriginPath(url: string): boolean {
  return url.startsWith('/') && !url.startsWith('//');
}

function needsPdfProxy(url: string): boolean {
  return url.startsWith('https://') && url.includes('res.cloudinary.com');
}

/**
 * Same-origin URL for embedding PDFs in an iframe.
 * Local /uploads paths load directly; Cloudinary CDN URLs are proxied via /api/pdf.
 */
export function getPdfEmbedUrl(fileUrl: string, fileName?: string): string {
  const base = fileUrl.split('#')[0] ?? fileUrl;

  if (isSameOriginPath(base)) {
    return `${base}${PDF_VIEWER_HASH}`;
  }

  if (needsPdfProxy(base)) {
    const params = new URLSearchParams({ url: base });
    if (fileName?.trim()) {
      params.set('filename', fileName.trim());
    }
    return `/api/pdf?${params.toString()}${PDF_VIEWER_HASH}`;
  }

  return `${base}${PDF_VIEWER_HASH}`;
}

export function isPdfUrl(url: string, mimeType?: string | null): boolean {
  if (mimeType === 'application/pdf') return true;

  const lower = url.toLowerCase();

  if (/\.pdf($|[?#&/])/i.test(url)) return true;
  if (lower.includes('.pdf')) return true;
  if (/format=pdf/i.test(lower)) return true;

  return false;
}
