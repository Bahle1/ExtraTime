import { EpisodeBuilder, SocialPostBuilder } from '@extratime/shared/testing';
import { describe, expect, it } from 'vitest';
import { buildTestDataset, OK_SOURCES } from '../../../test/support/test-app.js';
import { validateMockDataset, type RawMockDataset } from './mock-dataset.js';

const valid = buildTestDataset();
const episode = new EpisodeBuilder().build();
const AUDIO = {
  url: 'https://cdn.extratime.example/s03e14.mp3',
  mimeType: 'audio/mpeg',
  sizeBytes: null,
};

function withDefect(defect: Partial<RawMockDataset>): RawMockDataset {
  return { ...valid, ...defect };
}

describe('TC-API-014 validateMockDataset', () => {
  it('GIVEN the builder dataset WHEN validated THEN it is returned unchanged', () => {
    expect(validateMockDataset(valid)).toEqual({ ok: true, dataset: valid });
  });

  it.each([
    {
      defect: 'a schema defect (uppercase slug)',
      raw: withDefect({ episodes: [{ ...episode, slug: 'S03E14-Derby' }] }),
      issue: { file: 'episodes.json', path: '$[0].slug' },
    },
    {
      defect: 'a duplicate slug',
      raw: withDefect({
        episodes: [episode, new EpisodeBuilder().with({ id: 'ep_s03e15' }).build()],
      }),
      issue: { file: 'episodes.json', path: '$[1].slug' },
    },
    {
      defect: 'a dangling host reference',
      raw: withDefect({ hosts: valid.hosts.slice(0, 1) }),
      issue: { file: 'episodes.json', path: '$[0].hosts[1].slug' },
    },
    {
      defect: 'a dangling related episode',
      raw: withDefect({
        socialPosts: [
          new SocialPostBuilder().relatedTo({ id: 'ep_s09e99', slug: 's09e99-missing' }).build(),
        ],
      }),
      issue: { file: 'social-posts.json', path: '$[0].relatedEpisodeId' },
    },
    {
      defect: 'statuses out of PLATFORMS order',
      raw: withDefect({ sourceStatuses: OK_SOURCES.toReversed() }),
      issue: { file: 'source-statuses.json', path: '$' },
    },
    {
      defect: 'an audio file',
      raw: withDefect({
        episodes: [{ ...episode, media: { ...episode.media, preferred: 'audio', audio: AUDIO } }],
      }),
      issue: { file: 'episodes.json', path: '$[0].media.audio' },
    },
  ])(
    'GIVEN $defect WHEN validated THEN exactly one issue names its file and path',
    ({ raw, issue }) => {
      const result = validateMockDataset(raw);

      expect(result).toEqual({
        ok: false,
        issues: [{ ...issue, message: expect.any(String) }],
      });
    },
  );
});
