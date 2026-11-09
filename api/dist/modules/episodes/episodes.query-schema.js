import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MAX_QUERY_LENGTH, PlatformSchema, SlugSchema, } from '@extratime/shared';
import { z } from 'zod';
import { DEFAULT_EPISODE_SORT, EPISODE_SORTS } from './episodes.constants.js';
const FIRST_PAGE = 1;
/** GET /api/v1/episodes query: unknown keys rejected, defaults applied (LFR-05). */
export const EpisodeListQuerySchema = z.strictObject({
    page: z.coerce.number().int().positive().default(FIRST_PAGE),
    pageSize: z.coerce.number().int().positive().max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
    season: z.coerce.number().int().positive().optional(),
    host: SlugSchema.optional(),
    platform: PlatformSchema.optional(),
    q: z.string().trim().max(MAX_QUERY_LENGTH).optional(),
    sort: z.enum(EPISODE_SORTS).default(DEFAULT_EPISODE_SORT),
});
