/** Extract display/download filename from a stored file URL. */
export function extractFileNameFromFileUrl(url: string): string {
  if (!url.trim()) return 'resume.pdf';

  try {
    const pathname = new URL(url).pathname;
    const segment = pathname.split('/').filter(Boolean).pop();
    if (segment) return decodeURIComponent(segment);
  } catch {
    const segment = url.split('/').filter(Boolean).pop();
    if (segment) return decodeURIComponent(segment.split('?')[0] ?? segment);
  }

  return 'resume.pdf';
}

export function resolveResumeFileName(fileName: string | null | undefined, fileUrl: string): string {
  const trimmed = fileName?.trim();
  if (trimmed) return trimmed;
  return extractFileNameFromFileUrl(fileUrl);
}
