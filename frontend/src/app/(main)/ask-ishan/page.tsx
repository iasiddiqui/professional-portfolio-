import type { Metadata } from 'next';

import { AskIshanChat } from '@/features/ai/components/ask-ishan-chat';
import { PageHero } from '@/features/public/components/page-hero';
import { ROUTES } from '@/constants/routes';
import { createStaticPageMetadata } from '@/lib/seo/page-metadata';

export async function generateMetadata(): Promise<Metadata> {
  return createStaticPageMetadata(
    ROUTES.askIshan,
    'Ask Ishan AI',
    'Chat with an AI assistant — ask about Ishan\'s portfolio or get general dev help and answers.'
  );
}

export default function AskIshanPage() {
  return (
    <>
      <PageHero
        title="Questions answered instantly"
        description="Chat with an AI assistant — ask about Ishan's portfolio, services, and projects, or get general development help."
      />
      <section className="container mx-auto max-w-4xl px-4 pb-24">
        <AskIshanChat />
      </section>
    </>
  );
}
