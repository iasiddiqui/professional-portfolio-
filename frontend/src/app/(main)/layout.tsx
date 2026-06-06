import { MainLayout } from '@/components/layout/main-layout';

export const revalidate = 60;

export default function MainRouteLayout({ children }: { children: React.ReactNode }) {
  return <MainLayout>{children}</MainLayout>;
}
