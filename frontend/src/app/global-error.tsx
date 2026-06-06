'use client';

import { ErrorState } from '@/components/common/error-state';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <ErrorState title="Application error" message={error.message} onRetry={reset} />
      </body>
    </html>
  );
}
