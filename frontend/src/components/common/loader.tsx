'use client';

import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';

interface LoaderProps {
  className?: string;
  label?: string;
  fullScreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-10 w-10',
};

export function Loader({ className, label, fullScreen = false, size = 'md' }: LoaderProps) {
  const spinner = (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <Loader2 className={cn('animate-spin text-accent', sizeMap[size])} />
      {label ? <p className="text-sm text-muted-foreground">{label}</p> : null}
    </div>
  );

  if (fullScreen) {
    return <div className="flex min-h-[50vh] items-center justify-center">{spinner}</div>;
  }

  return spinner;
}
