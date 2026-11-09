import { z } from 'zod';
import {
  CountSchema,
  ImageUrlSchema,
  PlatformSchema,
  PublicUrlSchema,
  SlugSchema,
  TimestampSchema,
  prefixedIdSchema,
} from './primitives.schema.js';

const DimensionSchema = z.int().positive().nullable();

/** One image or video of a post; Meta CDN URLs may be null. */
export const SocialMediaSchema = z.object({
  type: z.enum(['image', 'video']),
  url: PublicUrlSchema.nullable(),
  thumbnailUrl: PublicUrlSchema.nullable(),
  width: DimensionSchema,
  height: DimensionSchema,
});

export const SocialPostSchema = z
  .object({
    id: prefixedIdSchema('sp_'),
    platform: PlatformSchema,
    kind: z.enum(['image', 'video', 'carousel', 'text', 'link']),
    caption: z.string().nullable(),
    permalink: PublicUrlSchema,
    publishedAt: TimestampSchema,
    media: z.array(SocialMediaSchema),
    author: z.object({
      name: z.string().min(1),
      handle: z.string().nullable(),
      avatarUrl: ImageUrlSchema.nullable(),
    }),
    metrics: z
      .object({
        likes: CountSchema,
        comments: CountSchema,
        shares: CountSchema,
        views: CountSchema,
      })
      .nullable(),
    relatedEpisodeId: prefixedIdSchema('ep_').nullable(),
    relatedEpisodeSlug: SlugSchema.nullable(),
    fetchedAt: TimestampSchema,
  })
  .refine((post) => (post.relatedEpisodeId === null) === (post.relatedEpisodeSlug === null), {
    error: 'relatedEpisodeId and relatedEpisodeSlug are both set or both null',
    path: ['relatedEpisodeSlug'],
  });

/** Unified social feed item. */
export type SocialPost = z.infer<typeof SocialPostSchema>;
