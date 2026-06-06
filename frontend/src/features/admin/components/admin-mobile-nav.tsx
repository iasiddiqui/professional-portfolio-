'use client';

import { AdminSidebar } from '@/features/admin/components/admin-sidebar';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { useUiStore } from '@/store/ui.store';

export function AdminMobileNav() {
  const { isMobileNavOpen, setMobileNavOpen } = useUiStore();

  return (
    <Drawer open={isMobileNavOpen} onOpenChange={setMobileNavOpen} direction="left">
      <DrawerContent className="h-full w-64 max-w-[85vw] rounded-none border-r p-0">
        <DrawerHeader className="sr-only">
          <DrawerTitle>Navigation</DrawerTitle>
        </DrawerHeader>
        <AdminSidebar onNavigate={() => setMobileNavOpen(false)} />
      </DrawerContent>
    </Drawer>
  );
}
