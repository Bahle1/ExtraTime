import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { EpisodeBuilder, GOLDEN_SOCIAL_FEED_PAGE_1, SocialPostBuilder } from '../testing/index.js';
import { SocialPostSchema } from './social-post.schema.js';

const [goldenReel, goldenPhoto] = z
  .object({ data: z.array(SocialPostSchema) })
  .parse(GOLDEN_SOCIAL_FEED_PAGE_1).data;

describe('TC-SH-008 SocialPost schema over the golden feed page', () => {
  it('GIVEN the golden feed page WHEN its posts are parsed THEN they pass with their nulls kept', () => {
    expect(goldenReel?.media[0]).toMatchObject({ url: null, width: null, height: null });
    expect(goldenReel?.metrics).toMatchObject({ shares: null, views: null });
    expect(goldenPhoto?.author).toMatchObject({ handle: null, avatarUrl: null });
    expect(goldenPhoto).toMatchObject({ relatedEpisodeId: null, relatedEpisodeSlug: null });
  });

  it.each([
    { half: 'an id without a slug', field: 'relatedEpisodeSlug' },
    { half: 'a slug without an id', field: 'relatedEpisodeId' },
  ] as const)('GIVEN $half WHEN parsed THEN it fails at relatedEpisodeSlug', ({ field }) => {
    const post = { ...new SocialPostBuilder().build(), [field]: null };

    expect(SocialPostSchema.safeParse(post).error?.issues[0]?.path).toEqual(['relatedEpisodeSlug']);
  });
});

describe('TC-SH-008 SocialPostBuilder defaults to the golden S03E14 reel', () => {
  it('GIVEN no overrides WHEN built THEN it is the golden reel, related to S03E14', () => {
    expect(new SocialPostBuilder().build()).toEqual(goldenReel);
  });

  it('GIVEN another episode WHEN relatedTo it THEN both related fields name that episode', () => {
    const episode = new EpisodeBuilder().withCode(1, 5).build();

    expect(new SocialPostBuilder().relatedTo(episode).build()).toMatchObject({
      relatedEpisodeId: 'ep_s01e05',
      relatedEpisodeSlug: 's01e05-derby-day-fallout',
    });
  });

  it('GIVEN an http permalink WHEN built THEN build throws', () => {
    const permalink = 'http://www.instagram.com/reel/DQf4kEr3eL1/';

    expect(() => new SocialPostBuilder().with({ permalink }).build()).toThrow();
  });
});
