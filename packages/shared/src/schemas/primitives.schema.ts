import { z } from 'zod';
import { MAX_SLUG_LENGTH } from '../constants/api-limits.constants.js';
import { PLATFORMS } from '../constants/platforms.constants.js';
import { SITE_IMAGE_PATH_PREFIX } from '../constants/site-images.constants.js';

const PATH_SEGMENT = '[A-Za-z0-9_-]+(?:\\.[A-Za-z0-9_-]+)*';
const SITE_IMAGE_PATH = new RegExp(
  `^${SITE_IMAGE_PATH_PREFIX}${PATH_SEGMENT}(?:/${PATH_SEGMENT})*$`,
);

export const PlatformSchema = z.enum(PLATFORMS);
export const SlugSchema = z
  .string()
  .max(MAX_SLUG_LENGTH)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
export const TimestampSchema = z.iso.datetime();
/** Raw platform count; null when the platform does not report it. */
export const CountSchema = z.int().nonnegative().nullable();
export const PublicUrlSchema = z.url({ protocol: /^https$/, hostname: z.regexes.domain });
export const SiteImagePathSchema = z.string().regex(SITE_IMAGE_PATH);
export const ImageUrlSchema = z.union([PublicUrlSchema, SiteImagePathSchema]);

export const ImageSchema = z.object({
  url: ImageUrlSchema,
  width: z.int().positive(),
  height: z.int().positive(),
  alt: z.string(),
});

/** Builds the schema of an opaque ID with a type prefix such as 'ep_'. */
export function prefixedIdSchema(prefix: `${string}_`) {
  return z.string().regex(new RegExp(`^${prefix}[A-Za-z0-9_-]+$`));
}

/** Aggregated platform. */
export type Platform = z.infer<typeof PlatformSchema>;
/** Lowercase kebab-case routing key. */
export type Slug = z.infer<typeof SlugSchema>;
/** ISO 8601 UTC timestamp ending in Z. */
export type Timestamp = z.infer<typeof TimestampSchema>;
/** Absolute https URL. */
export type PublicUrl = z.infer<typeof PublicUrlSchema>;
/** Root-relative /images/ path. */
export type SiteImagePath = z.infer<typeof SiteImagePathSchema>;
/** PublicUrl or SiteImagePath. */
export type ImageUrl = z.infer<typeof ImageUrlSchema>;
/** Image with intrinsic dimensions. */
export type Image = z.infer<typeof ImageSchema>;
