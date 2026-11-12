import { SocialFeedResponseSchema } from '@extratime/shared';
import { GOLDEN_SOCIAL_FEED_PAGE_1 } from '@extratime/shared/testing';
import { describe, expect, it } from 'vitest';
import { ValidationError } from '../../http/domain-errors.js';
import {
  decodeFeedCursor,
  encodeFeedCursor,
  FeedCursorError,
  isAfterCursor,
} from './feed-cursor.js';
import { MAX_CURSOR_LENGTH } from './social.constants.js';

const GOLDEN_FEED = SocialFeedResponseSchema.parse(GOLDEN_SOCIAL_FEED_PAGE_1);
const LONG_ID = `sp_fb_${'9'.repeat(80)}`;

function base64url(text: string): string {
  return Buffer.from(text, 'utf8').toString('base64url');
}

describe('TC-API-030 feed cursor codec', () => {
  it.each([
    {
      key: 'an Instagram post',
      cursor: { publishedAt: '2026-11-04T19:05:00Z', id: 'sp_ig_17958312045561234' },
    },
    {
      key: 'a millisecond timestamp',
      cursor: { publishedAt: '2026-11-03T17:30:00.250Z', id: 'sp_yt_Xk3pQ9vL2mA' },
    },
    { key: 'a long Facebook id', cursor: { publishedAt: '2026-11-03T17:30:00Z', id: LONG_ID } },
  ])(
    'GIVEN $key WHEN encoded and decoded THEN it round-trips unpadded within 200 characters',
    ({ cursor }) => {
      const encoded = encodeFeedCursor(cursor);

      expect(encoded).toMatch(/^[A-Za-z0-9_-]+$/);
      expect(encoded.length).toBeLessThanOrEqual(MAX_CURSOR_LENGTH);
      expect(decodeFeedCursor(encoded)).toEqual(cursor);
    },
  );

  it('GIVEN the last post of the golden feed page WHEN encoded THEN it equals the golden nextCursor', () => {
    const last = GOLDEN_FEED.data.at(-1);

    expect(last && encodeFeedCursor(last)).toBe(GOLDEN_FEED.meta.nextCursor);
  });

  it.each([
    { cursor: 'malformed characters', value: 'not a cursor!' },
    { cursor: 'an empty string', value: '' },
    { cursor: 'base64url of non-JSON', value: base64url('{"v":1,') },
    { cursor: 'version 2', value: base64url('{"v":2,"p":"2026-11-04T19:05:00Z","i":"sp_ig_1"}') },
    {
      cursor: 'an offset timestamp',
      value: base64url('{"v":1,"p":"2026-11-04T19:05:00+01:00","i":"sp_ig_1"}'),
    },
    {
      cursor: 'an extra field',
      value: base64url('{"v":1,"p":"2026-11-04T19:05:00Z","i":"sp_ig_1","x":0}'),
    },
    { cursor: 'a 201-character value', value: 'A'.repeat(MAX_CURSOR_LENGTH + 1) },
  ])('GIVEN $cursor WHEN decoded THEN FeedCursorError reports query.cursor', ({ value }) => {
    const decode = (): unknown => decodeFeedCursor(value);

    expect(decode).toThrow(FeedCursorError);
    expect(decode).toThrow(ValidationError);
    expect(decode).toThrow(
      expect.objectContaining({ issues: [expect.objectContaining({ path: 'query.cursor' })] }),
    );
  });

  it.each([
    { post: 'an older post', publishedAt: '2026-11-03T17:30:00Z', id: 'sp_ig_9', after: true },
    { post: 'a newer post', publishedAt: '2026-11-05T09:00:00Z', id: 'sp_ig_0', after: false },
    {
      post: 'a same-time lower id',
      publishedAt: '2026-11-04T19:05:00Z',
      id: 'sp_ig_1',
      after: true,
    },
    {
      post: 'a same-time higher id',
      publishedAt: '2026-11-04T19:05:00Z',
      id: 'sp_ig_3',
      after: false,
    },
    { post: 'the key itself', publishedAt: '2026-11-04T19:05:00Z', id: 'sp_ig_2', after: false },
  ])(
    'GIVEN $post WHEN compared with the key THEN isAfterCursor is $after',
    ({ publishedAt, id, after }) => {
      const key = { publishedAt: '2026-11-04T19:05:00Z', id: 'sp_ig_2' };

      expect(isAfterCursor({ publishedAt, id }, key)).toBe(after);
    },
  );
});
