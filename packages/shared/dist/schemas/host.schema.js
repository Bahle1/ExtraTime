import { z } from 'zod';
import { MAX_SHORT_BIO_LENGTH } from '../constants/api-limits.constants.js';
import { EpisodeSummarySchema } from './episode.schema.js';
import { ImageSchema, PlatformSchema, PublicUrlSchema, SlugSchema, prefixedIdSchema, } from './primitives.schema.js';
/** Host follow link; handle carries no leading @. */
export const SocialLinkSchema = z.object({
    platform: PlatformSchema,
    url: PublicUrlSchema,
    handle: z.string().regex(/^[^@\s]+$/),
});
export const HostSchema = z.object({
    id: prefixedIdSchema('host_'),
    slug: SlugSchema,
    name: z.string().min(1),
    role: z.enum(['Lead host', 'Co-host', 'Analyst', 'Producer']),
    shortBio: z.string().max(MAX_SHORT_BIO_LENGTH),
    bio: z.string(),
    avatar: ImageSchema.nullable(),
    favoriteClub: z.string().nullable(),
    socialLinks: z.array(SocialLinkSchema),
});
export const HostDetailSchema = HostSchema.extend({
    recentEpisodes: z.array(EpisodeSummarySchema),
});
