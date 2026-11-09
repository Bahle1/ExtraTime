import { z } from 'zod';
import { MAX_SUMMARY_LENGTH } from '../constants/api-limits.constants.js';
import {
  CountSchema,
  ImageSchema,
  ImageUrlSchema,
  PlatformSchema,
  PublicUrlSchema,
  SlugSchema,
  TimestampSchema,
  prefixedIdSchema,
} from './primitives.schema.js';

const YOUTUBE_VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;

export const HostSummarySchema = z.object({
  id: prefixedIdSchema('host_'),
  slug: SlugSchema,
  name: z.string().min(1),
  avatarUrl: ImageUrlSchema.nullable(),
});

export const EpisodeAudioSchema = z.object({
  url: PublicUrlSchema,
  mimeType: z.string().min(1),
  sizeBytes: CountSchema,
});

export const EpisodeMediaSchema = z
  .object({
    preferred: z.enum(['audio', 'youtube']),
    audio: EpisodeAudioSchema.nullable(),
    video: z
      .object({
        provider: z.literal('youtube'),
        videoId: z.string().regex(YOUTUBE_VIDEO_ID),
        embedUrl: PublicUrlSchema,
        watchUrl: PublicUrlSchema,
      })
      .nullable(),
  })
  .refine(
    (media) =>
      media.audio === null
        ? media.preferred === 'youtube' && media.video !== null
        : media.preferred === 'audio',
    { error: 'audio when audio exists, else youtube with video', path: ['preferred'] },
  );

export const EpisodeSourceSchema = z.object({
  platform: PlatformSchema,
  externalId: z.string().min(1),
  url: PublicUrlSchema,
  publishedAt: TimestampSchema,
  metrics: z.object({ views: CountSchema, likes: CountSchema, comments: CountSchema }).nullable(),
  fetchedAt: TimestampSchema,
});

export const ChapterSchema = z.object({
  startSeconds: z.int().nonnegative(),
  title: z.string().min(1),
});
export const GuestSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable(),
});

export const EpisodeSummarySchema = z.object({
  id: prefixedIdSchema('ep_'),
  slug: SlugSchema,
  title: z.string().min(1),
  season: z.int().positive().nullable(),
  episodeNumber: z.int().positive().nullable(),
  episodeType: z.enum(['full', 'bonus', 'trailer']),
  summary: z.string().max(MAX_SUMMARY_LENGTH),
  publishedAt: TimestampSchema,
  durationSeconds: z.int().nonnegative(),
  artwork: ImageSchema,
  hosts: z.array(HostSummarySchema),
  media: EpisodeMediaSchema,
  platforms: z.array(PlatformSchema).min(1),
});

export const EpisodeSchema = EpisodeSummarySchema.extend({
  description: z.string(),
  updatedAt: TimestampSchema,
  guests: z.array(GuestSchema),
  tags: z.array(SlugSchema),
  chapters: z.array(ChapterSchema),
  sources: z.array(EpisodeSourceSchema).min(1),
});

/** Host reference inside episodes. */
export type HostSummary = z.infer<typeof HostSummarySchema>;
/** Audio file reserved for a future RSS source. */
export type EpisodeAudio = z.infer<typeof EpisodeAudioSchema>;
/** Playback options; preferred selects the engine. */
export type EpisodeMedia = z.infer<typeof EpisodeMediaSchema>;
/** One platform copy with raw, dated metrics. */
export type EpisodeSource = z.infer<typeof EpisodeSourceSchema>;
/** Chapter start. */
export type Chapter = z.infer<typeof ChapterSchema>;
/** Episode guest. */
export type Guest = z.infer<typeof GuestSchema>;
/** List projection for cards and rails. */
export type EpisodeSummary = z.infer<typeof EpisodeSummarySchema>;
/** Full episode. */
export type Episode = z.infer<typeof EpisodeSchema>;
