'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { TagEntity } from '@/features/blog/types/blog.types';

interface TagSelectorProps {
  tags: TagEntity[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  className?: string;
}

export function TagSelector({ tags, selectedIds, onChange, className }: TagSelectorProps) {
  const toggleTag = (tagId: string) => {
    if (selectedIds.includes(tagId)) {
      onChange(selectedIds.filter((id) => id !== tagId));
    } else {
      onChange([...selectedIds, tagId]);
    }
  };

  if (tags.length === 0) {
    return (
      <p className={cn('text-sm text-muted-foreground', className)}>
        No tags available. Create tags in Tag Management first.
      </p>
    );
  }

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {tags.map((tag) => {
        const selected = selectedIds.includes(tag.id);
        return (
          <button
            key={tag.id}
            type="button"
            onClick={() => toggleTag(tag.id)}
            className="focus:outline-none"
          >
            <Badge variant={selected ? 'accent' : 'outline'} className="cursor-pointer">
              {tag.name}
            </Badge>
          </button>
        );
      })}
    </div>
  );
}
