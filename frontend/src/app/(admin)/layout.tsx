import { AdminLayout } from '@/components/layout/admin-layout';
import { buildNoIndexMetadata } from '@/lib/seo/metadata';
import { getSeoSiteConfig } from '@/lib/seo/site-config';

export async function generateMetadata() {
  const site = await getSeoSiteConfig();
  return buildNoIndexMetadata('Admin', site);
}

export default function AdminRouteLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}
