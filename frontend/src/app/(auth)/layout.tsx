import { AuthLayout } from '@/components/layout/auth-layout';
import { buildNoIndexMetadata } from '@/lib/seo/metadata';
import { getSeoSiteConfig } from '@/lib/seo/site-config';

export async function generateMetadata() {
  const site = await getSeoSiteConfig();
  return buildNoIndexMetadata('Authentication', site);
}

export default function AuthRouteLayout({ children }: { children: React.ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>;
}
