import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface BlogStatusBadgeProps {
  published: boolean;
  className?: string;
}

export function BlogStatusBadge({ published, className }: BlogStatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'border-transparent',
        published
          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
          : 'bg-muted text-muted-foreground',
        className
      )}
    >
      {published ? 'Published' : 'Draft'}
    </Badge>
  );
}
