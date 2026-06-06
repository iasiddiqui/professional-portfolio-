import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Clock } from 'lucide-react';

import { JsonLd } from '@/components/seo/json-ld';
import { Badge } from '@/components/ui/badge';
import { ContentRenderer } from '@/features/public/components/content-renderer';
import { ROUTES } from '@/constants/routes';
import { buildBlogPostingSchema, buildBreadcrumbSchema } from '@/lib/seo/json-ld';
import { buildMetadata } from '@/lib/seo/metadata';
import { getSeoSiteConfig } from '@/lib/seo/site-config';
import { publicApi } from '@/lib/public-api';
import { resolveMediaUrl } from '@/lib/media-url';
import { formatDate } from '@/utils/date';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const site = await getSeoSiteConfig();

  try {
    const post = await publicApi.getBlogPost(slug);
    return buildMetadata(
      {
        title: post.seoTitle ?? post.title,
        description: post.seoDescription ?? post.excerpt,
        path: ROUTES.blogPost(slug),
        image: post.featuredImage,
        type: 'article',
        publishedTime: post.publishedAt ?? undefined,
        modifiedTime: post.updatedAt ?? post.publishedAt ?? undefined,
        authors: post.author ? [post.author.name] : undefined,
        keywords: post.tags.map((tag) => tag.name),
      },
      site
    );
  } catch {
    return buildMetadata(
      { title: 'Post not found', description: site.description, path: ROUTES.blog, noIndex: true },
      site
    );
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const site = await getSeoSiteConfig();

  let post;
  try {
    post = await publicApi.getBlogPost(slug);
  } catch {
    notFound();
  }

  const featuredImage = resolveMediaUrl(post.featuredImage);

  return (
    <article>
      <JsonLd
        data={[
          buildBlogPostingSchema(post, site),
          buildBreadcrumbSchema([
            { name: 'Home', path: ROUTES.home },
            { name: 'Blog', path: ROUTES.blog },
            { name: post.title, path: ROUTES.blogPost(post.slug) },
          ]),
        ]}
      />

      <section className="container mx-auto px-4 pb-10 pt-24">
        <div className="mx-auto max-w-3xl">
          <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            {post.category ? <span>{post.category.name}</span> : null}
            {post.publishedAt ? <span>{formatDate(post.publishedAt)}</span> : null}
            <span className="inline-flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {post.readingTimeMinutes} min read
            </span>
          </div>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{post.title}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p>
          {post.author ? (
            <p className="mt-4 text-sm text-muted-foreground">By {post.author.name}</p>
          ) : null}
          {post.tags.length > 0 ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag.id} variant="secondary" className="rounded-full">
                  {tag.name}
                </Badge>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {featuredImage ? (
        <section className="container mx-auto px-4 pb-12">
          <div className="relative mx-auto aspect-[16/9] max-w-4xl overflow-hidden rounded-2xl border border-border/60">
            <Image src={featuredImage} alt={post.title} fill className="object-cover" priority />
          </div>
        </section>
      ) : null}

      <section className="container mx-auto max-w-3xl px-4 pb-16">
        <div className="glass-panel rounded-2xl p-6 sm:p-10">
          <ContentRenderer content={post.content} className="text-base text-muted-foreground" />
        </div>
      </section>

      <section className="container mx-auto px-4 pb-24 text-center">
        <Link href={ROUTES.blog} className="text-sm text-accent hover:underline">
          ← Back to blog
        </Link>
      </section>
    </article>
  );
}
