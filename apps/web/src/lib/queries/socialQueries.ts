import type { Platform, SocialFeedResponse } from '@extratime/shared';
import { infiniteQueryOptions } from '@tanstack/react-query';
import { getJson } from '../api/apiClient';

const SOCIAL_STALE_TIME_MS = 30_000;
/** Page parameter of the first page; the fetcher never sends it as a cursor. */
const FIRST_PAGE_CURSOR = '';

/** GET /api/v1/social/feed parameters the Phase 1 UI sends; no platform means every platform. */
export type SocialFeedParams = {
  readonly limit: number;
  readonly platform?: Platform;
};

/** Query option factories for the social feed; cursors stay opaque (LFR-13, LD-05). */
export const socialQueries = {
  feed: (params: SocialFeedParams) =>
    infiniteQueryOptions({
      queryKey: ['social', params],
      queryFn: ({ pageParam, signal }) => {
        const cursor = pageParam === FIRST_PAGE_CURSOR ? undefined : pageParam;
        return getJson<SocialFeedResponse>('/social/feed', {
          query: { ...params, cursor },
          signal,
        });
      },
      initialPageParam: FIRST_PAGE_CURSOR,
      getNextPageParam: (lastPage) => lastPage.meta.nextCursor ?? undefined,
      staleTime: SOCIAL_STALE_TIME_MS,
    }),
};
