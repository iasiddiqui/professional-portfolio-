import Image, { type ImageProps } from 'next/image';

function shouldSkipOptimization(src: ImageProps['src']): boolean {
  if (typeof src !== 'string') return false;
  return (
    src.startsWith('/uploads/') ||
    src.includes('/uploads/') ||
    src.includes('res.cloudinary.com')
  );
}

/**
 * Wrapper around next/image that skips the optimizer for upload paths.
 * Prevents SSR 500s when files are missing or only exist on another environment.
 */
export function MediaImage({ unoptimized, ...props }: ImageProps) {
  return <Image {...props} unoptimized={unoptimized ?? shouldSkipOptimization(props.src)} />;
}
