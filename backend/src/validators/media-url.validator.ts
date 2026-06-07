import { z } from 'zod';

/** Absolute URLs (Cloudinary, etc.) or same-origin upload paths stored by the media service. */
export const optionalMediaUrlSchema = z
  .union([
    z.string().url(),
    z.string().regex(/^\/uploads\/.+/),
    z.literal(''),
    z.null(),
  ])
  .optional()
  .transform((value) => (value === '' || value === undefined ? null : (value ?? null)));
