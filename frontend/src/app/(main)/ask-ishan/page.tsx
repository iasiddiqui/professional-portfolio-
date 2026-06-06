import type { Metadata } from 'next';

import { AskIshanChat } from '@/features/ai/components/ask-ishan-chat';
import { PageHero } from '@/features/public/components/page-hero';
import { ROUTES } from '@/constants/routes';
import { createStaticPageMetadata } from '@/lib/seo/page-metadata';

export async function generateMetadata(): Promise<Metadata> {
  return createStaticPageMetadata(
    ROUTES.askIshan,
    'Ask Ishan AI',
    'Chat with an AI assistant trained on portfolio knowledge — services, experience, and project approach.'
  );
}

export default function AskIshanPage() {
  return (
    <>
      <PageHero
        eyebrow="Ask Ishan AI"
        title="Questions answered instantly"
        description="Chat with an AI assistant trained on Ishan's portfolio knowledge base — services, experience, and project approach."
      />
      <section className="container mx-auto max-w-4xl px-4 pb-24">
        <AskIshanChat />
      </section>
    </>
  );
}
