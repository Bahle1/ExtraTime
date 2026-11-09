import type { HostListResponse, HostResponse } from '@extratime/shared';
import { queryOptions } from '@tanstack/react-query';
import { getJson } from '../api/apiClient';

const HOSTS_STALE_TIME_MS = 60_000;

/** Query option factories for host data (LFR-13, LFR-18). */
export const hostQueries = {
  list: () =>
    queryOptions({
      queryKey: ['hosts'],
      queryFn: ({ signal }) => getJson<HostListResponse>('/hosts', { signal }),
      staleTime: HOSTS_STALE_TIME_MS,
    }),
  detail: (slug: string) =>
    queryOptions({
      queryKey: ['host', slug],
      queryFn: ({ signal }) =>
        getJson<HostResponse>(`/hosts/${encodeURIComponent(slug)}`, { signal }),
      staleTime: HOSTS_STALE_TIME_MS,
    }),
};
