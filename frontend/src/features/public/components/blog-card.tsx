import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Clock } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/constants/routes';
import type { PublicBlogPostSummary } from '@/features/public/types/public.types';
import { resolveMediaUrl } from '@/lib/media-url';
import { formatDate } from '@/utils/date';
import { cn } from '@/lib/utils';

interface BlogCardProps {
  post: PublicBlogPostSummary;
  className?: string;
}

export function BlogCard({ post, className }: BlogCardProps) {
  const image = resolveMediaUrl(post.featuredImage);

  return (
    <article
      className={cn(
        'group glass-panel overflow-hidden rounded-2xl transition-all duration-300 hover:border-border',
        className
      )}
    >
      <Link href={ROUTES.blogPost(post.slug)} className="block">
        {image ? (
          <div className="relative aspect-[16/9] overflow-hidden bg-muted/30">
            <Image
              src={image}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        ) : null}

        <div className="space-y-4 p-6">
          <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
            {post.category ? <span>{post.category.name}</span> : <span>Blog</span>}
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {post.readingTimeMinutes} min
            </span>
          </div>

          <div className="flex items-start justify-between gap-4">
            <h3 className="text-lg font-semibold tracking-tight">{post.title}</h3>
            <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </div>

          <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>

          <div className="flex flex-wrap items-center gap-2">
            {post.publishedAt ? (
              <span className="text-xs text-muted-foreground">{formatDate(post.publishedAt)}</span>
            ) : null}
            {post.tags.slice(0, 2).map((tag) => (
              <Badge key={tag.id} variant="secondary" className="rounded-full text-xs">
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>
      </Link>
    </article>
  );
}
