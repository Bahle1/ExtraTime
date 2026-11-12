import { describe, expect, it } from 'vitest';
import type { CatalogSnapshot } from '../../catalog/catalog.repository.js';
import { MockCatalogRepository } from '../../catalog/mock/mock-catalog.repository.js';

const FIXED_NOW = new Date('2026-11-08T09:00:00Z');
const YOUTUBE_THUMBNAIL = /^https:\/\/i\.ytimg\.com\/vi\/[A-Za-z0-9_-]{11}\/hqdefault\.jpg$/;

const snapshot: CatalogSnapshot = await (
  await MockCatalogRepository.fromDirectory({ clock: { now: () => FIXED_NOW } })
).getSnapshot();
const { episodes, hosts, socialPosts, meta } = snapshot;

function countBy<T>(items: readonly T[], key: (item: T) => string): Record<string, number> {
  const groups = Object.entries(Object.groupBy(items, key));
  return Object.fromEntries(groups.map(([name, group]) => [name, group?.length ?? 0]));
}

describe('TC-API-016 committed mock fixtures', () => {
  it('GIVEN the committed fixtures WHEN loaded THEN 7 episodes are 5 full (2 coded), a trailer and a bonus', () => {
    expect(episodes).toHaveLength(7);
    expect(countBy(episodes, (episode) => episode.episodeType)).toEqual({
      full: 5,
      trailer: 1,
      bonus: 1,
    });
    expect(episodes.filter((episode) => episode.season !== null)).toHaveLength(2);
  });

  it('GIVEN the committed episodes WHEN inspected THEN none has audio and every artwork is an i.ytimg thumbnail', () => {
    expect(episodes.every((episode) => episode.media.audio === null)).toBe(true);
    expect(episodes.every((episode) => YOUTUBE_THUMBNAIL.test(episode.artwork.url))).toBe(true);
  });

  it('GIVEN the committed hosts WHEN loaded THEN the two founders have no avatar', () => {
    expect(hosts.map((host) => [host.slug, host.avatar])).toEqual([
      ['shungu-dutiro', null],
      ['henry-nzuzi', null],
    ]);
  });

  it('GIVEN the committed posts WHEN loaded THEN 12 posts are 8 Instagram and 4 YouTube with 6 related', () => {
    expect(socialPosts).toHaveLength(12);
    expect(countBy(socialPosts, (post) => post.platform)).toEqual({ instagram: 8, youtube: 4 });
    expect(socialPosts.filter((post) => post.relatedEpisodeId !== null)).toHaveLength(6);
  });

  it('GIVEN the committed statuses WHEN loaded THEN facebook is disabled', () => {
    expect(meta.sources.find((source) => source.platform === 'facebook')?.status).toBe('disabled');
  });

  it('GIVEN Purpose - Bigger Than Football WHEN loaded THEN it is uncoded with Cavin Johnson and Jesse Donn and is about identity', () => {
    const episode = episodes.find((candidate) => candidate.id === 'ep_yt_1EPurDA9Jvo');

    expect(episode?.season).toBeNull();
    expect(episode?.guests.map((guest) => guest.name)).toEqual(['Cavin Johnson', 'Jesse Donn']);
    expect(`${episode?.summary ?? ''} ${episode?.tags.join(' ') ?? ''}`.toLowerCase()).toContain(
      'identity',
    );
  });
});
