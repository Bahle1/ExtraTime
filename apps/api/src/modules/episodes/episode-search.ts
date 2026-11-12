import type { Episode, Platform } from '@extratime/shared';
import type { EpisodeSort } from './episodes.constants.js';

/** Undefined filters are not applied. */
export interface EpisodeFilters {
  readonly season?: number;
  readonly host?: string;
  readonly platform?: Platform;
  readonly q?: string;
}

const COMBINING_MARKS = /\p{M}/gu;

/** Every active filter matches; q searches title, summary, guests and tags. */
export function matchesEpisodeFilters(episode: Episode, filters: EpisodeFilters): boolean {
  const { season, host, platform, q } = filters;
  if (season !== undefined && episode.season !== season) return false;
  if (host !== undefined && !episode.hosts.some((summary) => summary.slug === host)) return false;
  if (platform !== undefined && !episode.platforms.includes(platform)) return false;
  return q === undefined || searchableText(episode).includes(foldText(q));
}

/** publishedAt, then id, in the sort direction. */
export function compareEpisodes(sort: EpisodeSort): (a: Episode, b: Episode) => number {
  const direction = sort === '-publishedAt' ? -1 : 1;
  return (a, b) =>
    direction * (Date.parse(a.publishedAt) - Date.parse(b.publishedAt) || compareText(a.id, b.id));
}

function foldText(text: string): string {
  return text.normalize('NFKD').replace(COMBINING_MARKS, '').toLowerCase();
}

function searchableText(episode: Episode): string {
  const guestNames = episode.guests.map((guest) => guest.name);
  return foldText([episode.title, episode.summary, ...guestNames, ...episode.tags].join('\n'));
}

function compareText(a: string, b: string): number {
  return Number(a > b) - Number(a < b);
}
