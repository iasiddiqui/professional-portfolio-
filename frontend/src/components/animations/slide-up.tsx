'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';

import { cn } from '@/lib/utils';

interface SlideUpProps extends HTMLMotionProps<'div'> {
  delay?: number;
  offset?: number;
}

export function SlideUp({ children, className, delay = 0, offset = 24, ...props }: SlideUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: offset }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
