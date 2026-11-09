import { DEFAULT_FEED_LIMIT, MAX_FEED_LIMIT, PLATFORMS, PlatformSchema } from '@extratime/shared';
import { z } from 'zod';
const PLATFORM_SEPARATOR = ',';
const PlatformListSchema = z
    .string()
    .transform((value) => [...new Set(value.split(PLATFORM_SEPARATOR))])
    .pipe(z.array(PlatformSchema));
/** GET /api/v1/social/feed query: comma-separated platforms (default all), limit and an opaque cursor. */
export const SocialFeedQuerySchema = z.strictObject({
    platform: PlatformListSchema.default(() => [...PLATFORMS]),
    limit: z.coerce.number().int().positive().max(MAX_FEED_LIMIT).default(DEFAULT_FEED_LIMIT),
    cursor: z.string().optional(),
});
