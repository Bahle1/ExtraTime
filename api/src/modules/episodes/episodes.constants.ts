/** Episode list orders: newest or oldest first, ties broken by id. */
export const EPISODE_SORTS = ['-publishedAt', 'publishedAt'] as const;

/** One of EPISODE_SORTS. */
export type EpisodeSort = (typeof EPISODE_SORTS)[number];

/** Order of GET /api/v1/episodes without a sort parameter. */
export const DEFAULT_EPISODE_SORT: EpisodeSort = '-publishedAt';
