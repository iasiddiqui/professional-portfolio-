'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { AskIshanChat } from '@/features/ai/components/ask-ishan-chat';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';

export function AskIshanFloatingWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const hiddenOnPage = pathname === ROUTES.askIshan;

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  if (hiddenOnPage) return null;

  return (
    <div className="pointer-events-none fixed bottom-0 right-0 z-50 p-4 sm:p-6">
      <AnimatePresence>
        {open ? (
          <motion.div
            key="ask-ishan-panel"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="pointer-events-auto mb-4 w-[min(100vw-2rem,400px)] origin-bottom-right"
          >
            <AskIshanChat
              className="h-[min(560px,calc(100vh-7rem))]"
              onClose={() => setOpen(false)}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.div
        layout
        className="pointer-events-auto flex justify-end"
        initial={false}
      >
        <Button
          type="button"
          size="lg"
          variant="accent"
          aria-label={open ? 'Close Ask Ishan AI' : 'Open Ask Ishan AI chat'}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className={cn(
            'h-14 gap-2 rounded-full px-4 text-white shadow-lg transition-shadow hover:bg-accent/90 hover:shadow-xl sm:px-5'
          )}
        >
          {open ? (
            <>
              <X className="h-5 w-5" />
              <span className="hidden font-medium sm:inline">Close</span>
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              <span className="font-medium">Ask Ishan AI</span>
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
}
