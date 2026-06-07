function fileNameFromUrl(url: string): string {
  if (!url.trim()) return 'resume.pdf';

  try {
    const segment = new URL(url).pathname.split('/').filter(Boolean).pop();
    if (segment) return decodeURIComponent(segment);
  } catch {
    const segment = url.split('/').filter(Boolean).pop();
    if (segment) return decodeURIComponent(segment.split('?')[0] ?? segment);
  }

  return 'resume.pdf';
}

export function resolveResumeFileName(fileName: string | undefined, fileUrl: string): string {
  const trimmed = fileName?.trim();
  if (trimmed) return trimmed;
  return fileNameFromUrl(fileUrl);
}

/** @deprecated Use resolveResumeFileName */
export function fileNameFromFileUrl(url: string): string {
  return fileNameFromUrl(url);
}
