import type { ReactNode } from 'react';

export function GridBackground({ children }: { children?: ReactNode }) {
  return (
    <div className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 linear-glow" />
      <div aria-hidden className="pointer-events-none absolute inset-0 linear-grid opacity-40" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
