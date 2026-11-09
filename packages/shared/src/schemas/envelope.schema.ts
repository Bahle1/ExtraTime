import { z } from 'zod';
import { MAX_FEED_LIMIT } from '../constants/api-limits.constants.js';
import { EpisodeSchema, EpisodeSummarySchema } from './episode.schema.js';
import { HostDetailSchema, HostSchema } from './host.schema.js';
import { TimestampSchema } from './primitives.schema.js';
import { SocialPostSchema } from './social-post.schema.js';
import { SourceStatusListSchema } from './source-status.schema.js';

const MetaSchema = z.object({ generatedAt: TimestampSchema, sources: SourceStatusListSchema });

const CollectionMetaSchema = MetaSchema.extend({
  page: z.int().positive(),
  pageSize: z.int().positive(),
  totalItems: z.int().nonnegative(),
  totalPages: z.int().nonnegative(),
});

const CursorMetaSchema = MetaSchema.extend({
  limit: z.int().min(1).max(MAX_FEED_LIMIT),
  nextCursor: z.string().min(1).nullable(),
});

/** Page-based list envelope. */
export function collectionEnvelope<T extends z.ZodType>(item: T) {
  return z.object({ data: z.array(item), meta: CollectionMetaSchema });
}

/** Keyset list envelope; nextCursor is null on the last page. */
export function cursorEnvelope<T extends z.ZodType>(item: T) {
  return z.object({ data: z.array(item), meta: CursorMetaSchema });
}

/** Single-resource envelope. */
export function singleEnvelope<T extends z.ZodType>(data: T) {
  return z.object({ data, meta: MetaSchema });
}

export const EpisodeListResponseSchema = collectionEnvelope(EpisodeSummarySchema);
export const EpisodeResponseSchema = singleEnvelope(EpisodeSchema);
export const HostListResponseSchema = collectionEnvelope(HostSchema);
export const HostResponseSchema = singleEnvelope(HostDetailSchema);
export const SocialFeedResponseSchema = cursorEnvelope(SocialPostSchema);

/** GET /api/v1/episodes body. */
export type EpisodeListResponse = z.infer<typeof EpisodeListResponseSchema>;
/** GET /api/v1/episodes/:slug body. */
export type EpisodeResponse = z.infer<typeof EpisodeResponseSchema>;
/** GET /api/v1/hosts body. */
export type HostListResponse = z.infer<typeof HostListResponseSchema>;
/** GET /api/v1/hosts/:slug body. */
export type HostResponse = z.infer<typeof HostResponseSchema>;
/** GET /api/v1/social/feed body. */
export type SocialFeedResponse = z.infer<typeof SocialFeedResponseSchema>;
