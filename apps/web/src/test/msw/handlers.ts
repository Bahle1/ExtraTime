import type {
  Episode,
  EpisodeListResponse,
  HostDetail,
  HostListResponse,
  ProblemDetails,
  SocialFeedResponse,
  SourceStatus,
} from '@extratime/shared';
import { DEFAULT_FEED_LIMIT, DEFAULT_PAGE_SIZE, problemTypeUri } from '@extratime/shared/constants';
import { EpisodeBuilder, HostBuilder, SocialPostBuilder } from '@extratime/shared/testing';
import { http, HttpResponse } from 'msw';
import {
  API_BASE_PATH,
  HTTP_NOT_FOUND,
  PROBLEM_JSON_MEDIA_TYPE,
} from '../../lib/api/api.constants';

const GENERATED_AT = '2026-11-08T09:00:00Z';
const SOCIAL_POST_COUNT = 8;
const NEWEST_POST_MS = Date.parse('2026-11-07T19:00:00Z');
const POST_INTERVAL_MS = 86_400_000;
const RECENT_EPISODES_LIMIT = 6;
const FIRST_PAGE = 1;
const FIRST_POST_INDEX = 0;
/** Fixed not-found title the API renders (§3.5.10). */
const NOT_FOUND_TITLE = 'Resource not found';

const SOURCES: readonly SourceStatus[] = [
  { platform: 'youtube', status: 'ok', lastSuccessAt: GENERATED_AT, message: null },
  { platform: 'instagram', status: 'ok', lastSuccessAt: GENERATED_AT, message: null },
  { platform: 'facebook', status: 'disabled', lastSuccessAt: null, message: null },
];
const META = { generatedAt: GENERATED_AT, sources: [...SOURCES] };

const EPISODE_BUILDERS = [
  new EpisodeBuilder(),
  new EpisodeBuilder()
    .withCode(3, 13)
    .with({ slug: 's03e13-cup-run', title: 'Cup Run', publishedAt: '2026-10-26T18:00:00Z' }),
  new EpisodeBuilder().with({
    id: 'ep_yt_Xk3pQ9vL2mA',
    slug: 'season-3-trailer',
    title: 'Season 3 Trailer',
    season: null,
    episodeNumber: null,
    episodeType: 'trailer',
    publishedAt: '2026-08-30T18:00:00Z',
  }),
];

const HOST_BUILDERS = [
  new HostBuilder(),
  new HostBuilder().with({
    id: 'host_sam-okafor',
    slug: 'sam-okafor',
    name: 'Sam Okafor',
    role: 'Co-host',
    shortBio: 'Co-host and set-piece obsessive.',
    bio: 'Sam Okafor co-hosts every full episode.',
    avatar: null,
    favoriteClub: null,
    socialLinks: [],
  }),
];

const episodes = EPISODE_BUILDERS.map((builder) => builder.build());
const episodeSummaries = EPISODE_BUILDERS.map((builder) => builder.buildSummary());
const hosts = HOST_BUILDERS.map((builder) => builder.build());
const hostDetails = HOST_BUILDERS.map((builder) => {
  const { slug } = builder.build();
  const recent = episodeSummaries.filter((episode) => episode.hosts.some((h) => h.slug === slug));
  return builder.buildDetail(recent.slice(0, RECENT_EPISODES_LIMIT));
});
const socialPosts = Array.from({ length: SOCIAL_POST_COUNT }, (_, index) =>
  new SocialPostBuilder()
    .with({
      id: `sp_ig_test${index}`,
      publishedAt: new Date(NEWEST_POST_MS - index * POST_INTERVAL_MS).toISOString(),
    })
    .build(),
);

/** Builder-made data the default handlers serve, newest first (§3.9.6); never mutate it. */
export const testCatalog = {
  episodes,
  episodeSummaries,
  hosts,
  hostDetails,
  socialPosts,
  sources: SOURCES,
} as const;

function readCount(url: URL, key: string, fallback: number): number {
  const value = Number(url.searchParams.get(key));
  return Number.isInteger(value) && value > 0 ? value : fallback;
}

function episodePage(url: URL): EpisodeListResponse {
  const page = readCount(url, 'page', FIRST_PAGE);
  const pageSize = readCount(url, 'pageSize', DEFAULT_PAGE_SIZE);
  const start = (page - 1) * pageSize;
  const totalItems = episodeSummaries.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const data = episodeSummaries.slice(start, start + pageSize);
  return { data, meta: { ...META, page, pageSize, totalItems, totalPages } };
}

function hostList(): HostListResponse {
  const totalItems = hosts.length;
  return {
    data: hosts,
    meta: { ...META, page: FIRST_PAGE, pageSize: totalItems, totalItems, totalPages: FIRST_PAGE },
  };
}

function feedPage(url: URL): SocialFeedResponse {
  const limit = readCount(url, 'limit', DEFAULT_FEED_LIMIT);
  const start = readCount(url, 'cursor', FIRST_POST_INDEX);
  const end = start + limit;
  const nextCursor = end < socialPosts.length ? String(end) : null;
  return { data: socialPosts.slice(start, end), meta: { ...META, limit, nextCursor } };
}

function notFound(request: Request): Response {
  const instance = new URL(request.url).pathname;
  return HttpResponse.json<ProblemDetails>(
    {
      type: problemTypeUri('not-found'),
      title: NOT_FOUND_TITLE,
      status: HTTP_NOT_FOUND,
      detail: `Nothing was found at ${instance}.`,
      instance,
      requestId: null,
    },
    { status: HTTP_NOT_FOUND, headers: { 'Content-Type': PROBLEM_JSON_MEDIA_TYPE } },
  );
}

function single<T extends Episode | HostDetail>(item: T | undefined, request: Request): Response {
  return item === undefined ? notFound(request) : HttpResponse.json({ data: item, meta: META });
}

/** Default handlers for every Phase 1 catalog endpoint; tests override them with server.use (LD-09). */
export const handlers = [
  http.get(`${API_BASE_PATH}/episodes`, ({ request }) =>
    HttpResponse.json<EpisodeListResponse>(episodePage(new URL(request.url))),
  ),
  http.get<{ slug: string }>(`${API_BASE_PATH}/episodes/:slug`, ({ params, request }) =>
    single(
      episodes.find((episode) => episode.slug === params.slug),
      request,
    ),
  ),
  http.get(`${API_BASE_PATH}/hosts`, () => HttpResponse.json<HostListResponse>(hostList())),
  http.get<{ slug: string }>(`${API_BASE_PATH}/hosts/:slug`, ({ params, request }) =>
    single(
      hostDetails.find((host) => host.slug === params.slug),
      request,
    ),
  ),
  http.get(`${API_BASE_PATH}/social/feed`, ({ request }) =>
    HttpResponse.json<SocialFeedResponse>(feedPage(new URL(request.url))),
  ),
];
