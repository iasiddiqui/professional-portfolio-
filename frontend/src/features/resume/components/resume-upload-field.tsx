'use client';

import { useMutation } from '@tanstack/react-query';
import { ExternalLink, FileText, Link2, Loader2, Trash2, Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { resumeService } from '@/features/resume/services/resume.service';
import { getErrorMessage } from '@/lib/errors';
import { resolveResumeFileName } from '@/lib/file-url';
import { resolveMediaUrl } from '@/lib/media-url';
import { cn } from '@/lib/utils';

interface ResumeUploadFieldProps {
  value: string;
  fileName?: string;
  onChange: (url: string) => void;
  onFileNameChange?: (filename: string) => void;
  onUploadSuccess?: () => void;
  initialUseExternalUrl?: boolean;
  error?: string;
  className?: string;
}

function fileLabelFromUrl(url: string): string {
  if (!url) return '';

  try {
    const parsed = new URL(url, 'http://localhost');
    const name = parsed.pathname.split('/').pop();
    return name ? decodeURIComponent(name) : url;
  } catch {
    return url.split('/').pop() ?? url;
  }
}

export function ResumeUploadField({
  value,
  fileName,
  onChange,
  onFileNameChange,
  onUploadSuccess,
  initialUseExternalUrl = false,
  error,
  className,
}: ResumeUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [useExternalUrl, setUseExternalUrl] = useState(initialUseExternalUrl);

  const uploadMutation = useMutation({
    mutationFn: (file: File) => resumeService.upload(file),
    onSuccess: (result) => {
      onChange(result.url);
      onFileNameChange?.(result.filename);
      setUseExternalUrl(false);
      onUploadSuccess?.();
    },
    onError: (err) => toast.error(getErrorMessage(err, 'Upload failed')),
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) uploadMutation.mutate(file);
    event.target.value = '';
  };

  const previewUrl = value ? resolveMediaUrl(value) : null;
  const fileLabel = resolveResumeFileName(fileName, value);
  const showUploadedCard = Boolean(value) && !useExternalUrl;

  const switchToUpload = () => {
    setUseExternalUrl(false);
    onChange('');
    onFileNameChange?.('');
  };

  const switchToUrl = () => {
    setUseExternalUrl(true);
    onChange('');
    onFileNameChange?.('');
  };

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between gap-3">
        <Label>Resume file</Label>
        <div className="flex items-center gap-1 rounded-md border p-0.5">
          <Button
            type="button"
            size="sm"
            variant={!useExternalUrl ? 'secondary' : 'ghost'}
            className="h-7 px-2.5 text-xs"
            onClick={switchToUpload}
          >
            <Upload className="mr-1.5 h-3.5 w-3.5" />
            Upload
          </Button>
          <Button
            type="button"
            size="sm"
            variant={useExternalUrl ? 'secondary' : 'ghost'}
            className="h-7 px-2.5 text-xs"
            onClick={switchToUrl}
          >
            <Link2 className="mr-1.5 h-3.5 w-3.5" />
            URL
          </Button>
        </div>
      </div>

      {!useExternalUrl ? (
        <>
          {showUploadedCard ? (
            <div className="rounded-lg border bg-muted/20 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border bg-background">
                  <FileText className="h-5 w-5 text-accent" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{fileLabel}</p>
                  {previewUrl ? (
                    <a
                      href={previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-0.5 inline-flex items-center gap-1 text-xs text-accent hover:underline"
                    >
                      Preview
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : null}
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => inputRef.current?.click()}
                    disabled={uploadMutation.isPending}
                  >
                    Replace
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    aria-label="Remove file"
                    onClick={() => {
                      onChange('');
                      onFileNameChange?.('');
                    }}
                    disabled={uploadMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploadMutation.isPending}
              className={cn(
                'flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed px-4 py-10 text-sm transition-colors',
                'hover:border-accent/50 hover:bg-muted/30',
                error && 'border-destructive'
              )}
            >
              {uploadMutation.isPending ? (
                <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-lg border bg-muted/30">
                  <Upload className="h-5 w-5 text-muted-foreground" />
                </div>
              )}
              <span className="font-medium">
                {uploadMutation.isPending ? 'Uploading...' : 'Choose a file from your computer'}
              </span>
              <span className="text-xs text-muted-foreground">PDF, DOC, or DOCX · max 5 MB</span>
            </button>
          )}

          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="hidden"
            onChange={handleFileChange}
          />
        </>
      ) : (
        <div className="space-y-2">
          <Input
            value={value}
            onChange={(event) => {
              onChange(event.target.value);
              onFileNameChange?.(fileLabelFromUrl(event.target.value));
            }}
            placeholder="https://example.com/resume.pdf"
            spellCheck={false}
          />
          <p className="text-xs text-muted-foreground">Link to a publicly accessible resume file.</p>
        </div>
      )}

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
