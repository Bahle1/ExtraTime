import type { EpisodeListResponse, EpisodeResponse } from '@extratime/shared';
import { queryOptions } from '@tanstack/react-query';
import { getJson } from '../api/apiClient';

const EPISODES_STALE_TIME_MS = 60_000;
/** Newest episodes shown by the home hero (1) and rail (6) and by "More episodes". */
export const LATEST_EPISODES_COUNT = 7;

/** GET /api/v1/episodes parameters the Phase 1 UI sends; filters arrive in T2A.16. */
export type EpisodeListParams = {
  readonly page?: number;
  readonly pageSize?: number;
  readonly q?: string;
};

function listOptions(params: EpisodeListParams) {
  return queryOptions({
    queryKey: ['episodes', params],
    queryFn: ({ signal }) => getJson<EpisodeListResponse>('/episodes', { query: params, signal }),
    staleTime: EPISODES_STALE_TIME_MS,
  });
}

/** Query option factories for episode data (LFR-13). */
export const episodeQueries = {
  list: listOptions,
  latest: () => listOptions({ page: 1, pageSize: LATEST_EPISODES_COUNT }),
  detail: (slug: string) =>
    queryOptions({
      queryKey: ['episode', slug],
      queryFn: ({ signal }) =>
        getJson<EpisodeResponse>(`/episodes/${encodeURIComponent(slug)}`, { signal }),
      staleTime: EPISODES_STALE_TIME_MS,
    }),
};
