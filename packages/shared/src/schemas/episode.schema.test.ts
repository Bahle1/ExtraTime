import { describe, expect, it } from 'vitest';
import { MAX_SUMMARY_LENGTH } from '../constants/api-limits.constants.js';
import { EpisodeBuilder, GOLDEN_EPISODE_S03E14 } from '../testing/index.js';
import { EpisodeMediaSchema, EpisodeSchema, EpisodeSourceSchema } from './episode.schema.js';

const golden = EpisodeSchema.parse(GOLDEN_EPISODE_S03E14);
const goldenYoutubeCopy = EpisodeSourceSchema.parse(golden.sources[0]);
const goldenFacebookCopy = EpisodeSourceSchema.parse(golden.sources[1]);
const AUDIO = { url: 'https://x.extratime.example/a.mp3', mimeType: 'audio/mpeg', sizeBytes: null };
const OVERSIZE_SUMMARY = 'a'.repeat(MAX_SUMMARY_LENGTH + 1);
const SHORT_ID_MEDIA = { ...golden.media, video: { ...golden.media.video, videoId: 'Xk3pQ9vL2m' } };
const NEGATIVE_START = [{ startSeconds: -1, title: 'Intro' }];

describe('TC-SH-004 Episode schema over the golden S03E14', () => {
  it('GIVEN the golden S03E14 WHEN parsed THEN it passes with both platform copies', () => {
    const result = EpisodeSchema.safeParse(GOLDEN_EPISODE_S03E14);

    expect(result.data?.platforms).toEqual(['youtube', 'facebook']);
  });

  it.each([
    { change: 'an uppercase slug', field: 'slug', value: 'S03E14-derby-day-fallout' },
    { change: 'a +01:00 timestamp', field: 'publishedAt', value: '2026-11-02T19:00:00+01:00' },
    { change: 'a 281-character summary', field: 'summary', value: OVERSIZE_SUMMARY },
    { change: 'a 10-character videoId', field: 'media', value: SHORT_ID_MEDIA },
    { change: 'a negative chapter start', field: 'chapters', value: NEGATIVE_START },
  ] as const)(
    'GIVEN the golden with $change WHEN parsed THEN it fails at $field',
    ({ field, value }) => {
      const result = EpisodeSchema.safeParse({ ...golden, [field]: value });

      expect(result.error?.issues[0]?.path[0]).toBe(field);
    },
  );
});

describe('TC-SH-004 EpisodeBuilder defaults to the golden S03E14', () => {
  it('GIVEN no overrides WHEN built THEN it is the golden S03E14 with its YouTube copy only', () => {
    const expected = { ...golden, sources: [goldenYoutubeCopy], platforms: ['youtube'] };

    expect(new EpisodeBuilder().build()).toEqual(expected);
  });

  it('GIVEN the golden Facebook copy WHEN added with withSource THEN platforms follow', () => {
    const episode = new EpisodeBuilder().withSource(goldenFacebookCopy).build();

    expect(episode.platforms).toEqual(['youtube', 'facebook']);
  });

  it('GIVEN season 1 episode 5 WHEN set with withCode THEN id and slug carry the code', () => {
    const episode = new EpisodeBuilder().withCode(1, 5).build();

    expect(episode).toMatchObject({ id: 'ep_s01e05', slug: 's01e05-derby-day-fallout', season: 1 });
  });

  it('GIVEN an invalid override WHEN built THEN build throws', () => {
    expect(() => new EpisodeBuilder().with({ slug: 'Derby Day' }).build()).toThrow();
  });

  it('GIVEN the default episode WHEN built as a summary THEN detail fields are stripped', () => {
    expect(new EpisodeBuilder().buildSummary()).not.toHaveProperty('description');
  });
});

describe('TC-SH-005 EpisodeMedia playability', () => {
  it.each([
    { media: 'youtube with null audio', input: golden.media },
    { media: 'an audio object', input: { ...golden.media, preferred: 'audio', audio: AUDIO } },
  ])('GIVEN $media WHEN parsed THEN it passes', ({ input }) => {
    expect(EpisodeMediaSchema.safeParse(input).success).toBe(true);
  });

  it.each([
    { media: 'preferred audio with null audio', input: { ...golden.media, preferred: 'audio' } },
    { media: 'both audio and video null', input: { ...golden.media, video: null } },
  ])('GIVEN $media WHEN parsed THEN it fails at preferred', ({ input }) => {
    expect(EpisodeMediaSchema.safeParse(input).error?.issues[0]?.path).toEqual(['preferred']);
  });
});
