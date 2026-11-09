import { describe, expect, it } from 'vitest';
import { EpisodeBuilder, GOLDEN_SOCIAL_FEED_PAGE_1, HostBuilder } from '../testing/index.js';
import {
  EpisodeListResponseSchema,
  EpisodeResponseSchema,
  HostListResponseSchema,
  HostResponseSchema,
  SocialFeedResponseSchema,
} from './envelope.schema.js';

const feed = SocialFeedResponseSchema.parse(GOLDEN_SOCIAL_FEED_PAGE_1);
const meta = { generatedAt: feed.meta.generatedAt, sources: feed.meta.sources };
const listMeta = { ...meta, page: 1, pageSize: 1, totalItems: 1, totalPages: 1 };
const episode = new EpisodeBuilder().build();
const summary = new EpisodeBuilder().buildSummary();
const host = new HostBuilder().build();
const hostDetail = new HostBuilder().buildDetail([summary]);

describe('TC-SH-010 response envelopes', () => {
  it('GIVEN the golden feed page WHEN parsed as a cursor envelope THEN it keeps its cursor', () => {
    const result = SocialFeedResponseSchema.safeParse(GOLDEN_SOCIAL_FEED_PAGE_1);

    expect(result.data?.meta).toMatchObject({ limit: 2, nextCursor: expect.any(String) });
  });

  it.each([
    { envelope: 'EpisodeList', schema: EpisodeListResponseSchema, data: [summary], meta: listMeta },
    { envelope: 'Episode', schema: EpisodeResponseSchema, data: episode, meta },
    { envelope: 'HostList', schema: HostListResponseSchema, data: [host], meta: listMeta },
    { envelope: 'Host', schema: HostResponseSchema, data: hostDetail, meta },
  ])(
    'GIVEN a $envelope response with the feed meta WHEN parsed THEN it passes',
    ({ schema, data, meta: envelopeMeta }) => {
      expect(schema.safeParse({ data, meta: envelopeMeta }).success).toBe(true);
    },
  );

  it.each([
    { change: 'no meta.sources', brokenMeta: { generatedAt: meta.generatedAt } },
    { change: 'sources reordered', brokenMeta: { ...meta, sources: meta.sources.toReversed() } },
    { change: 'a platform missing', brokenMeta: { ...meta, sources: meta.sources.slice(1) } },
  ])(
    'GIVEN an Episode response with $change WHEN parsed THEN it fails at meta.sources',
    ({ brokenMeta }) => {
      const result = EpisodeResponseSchema.safeParse({ data: episode, meta: brokenMeta });

      expect(result.error?.issues[0]?.path).toEqual(['meta', 'sources']);
    },
  );
});
