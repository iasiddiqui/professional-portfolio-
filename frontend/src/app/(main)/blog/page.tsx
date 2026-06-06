import type { Metadata } from 'next';

import { JsonLd } from '@/components/seo/json-ld';
import { BlogCard } from '@/features/public/components/blog-card';
import { PageHero } from '@/features/public/components/page-hero';
import { ROUTES } from '@/constants/routes';
import { buildBreadcrumbSchema, buildCollectionPageSchema } from '@/lib/seo/json-ld';
import { createStaticPageMetadata } from '@/lib/seo/page-metadata';
import { publicApi } from '@/lib/public-api';

const description = 'Articles on engineering, product, and building in production.';

export async function generateMetadata(): Promise<Metadata> {
  return createStaticPageMetadata(ROUTES.blog, 'Blog', description);
}

export default async function BlogPage() {
  const result = await publicApi.listBlogPosts({ limit: 24 }).catch(() => null);
  const posts = result?.items ?? [];

  return (
    <>
      <JsonLd
        data={[
          buildCollectionPageSchema('Blog', description, ROUTES.blog),
          buildBreadcrumbSchema([
            { name: 'Home', path: ROUTES.home },
            { name: 'Blog', path: ROUTES.blog },
          ]),
        ]}
      />
      <PageHero
        eyebrow="Blog"
        title="Thinking in public"
        description="Long-form notes on architecture, delivery, and the craft of building software."
      />

      <section className="container mx-auto px-4 pb-24">
        {posts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="glass-panel rounded-2xl p-10 text-center text-sm text-muted-foreground">
            Published blog posts will appear here.
          </div>
        )}
      </section>
    </>
  );
}
