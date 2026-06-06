'use client';

import { motion, useInView, type HTMLMotionProps } from 'framer-motion';
import { useRef } from 'react';

import { cn } from '@/lib/utils';

interface SectionRevealProps extends HTMLMotionProps<'section'> {
  offset?: number;
}

export function SectionReveal({ children, className, offset = 32, ...props }: SectionRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: offset }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: offset }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.section>
  );
}
