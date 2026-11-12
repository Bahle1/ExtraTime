/** Brand name shown in the header, footer and page titles. */
export const SITE_NAME = 'ExtraTime';

/** ExtraTime slogan. */
export const SITE_SLOGAN = 'The conversation beyond the game';

/** Id of the main landmark; the skip link targets it. */
export const MAIN_CONTENT_ID = 'main';

/** One entry of the primary navigation. */
export interface NavItem {
  readonly to: string;
  readonly label: string;
}

/** Primary navigation, in display order. */
export const PRIMARY_NAV_ITEMS: readonly NavItem[] = [
  { to: '/episodes', label: 'Episodes' },
  { to: '/hosts', label: 'Hosts' },
  { to: '/social', label: 'Social' },
  { to: '/about', label: 'About' },
];

/** Platforms with a confirmed ExtraTIME profile (LQ-24: no Facebook Page yet). */
export type FollowPlatform = 'youtube' | 'instagram' | 'tiktok';

/** One follow link to an official ExtraTIME profile. */
export interface FollowLink {
  readonly platform: FollowPlatform;
  readonly label: string;
  readonly handle: string;
  readonly url: string;
}

/** Official profiles from the public channel facts (2026-11-08), in display order (LFR-20). */
export const FOLLOW_LINKS: readonly FollowLink[] = [
  {
    platform: 'youtube',
    label: 'YouTube',
    handle: '@extratimeorg',
    url: 'https://www.youtube.com/@extratimeorg',
  },
  {
    platform: 'instagram',
    label: 'Instagram',
    handle: '@extra.timeorg',
    url: 'https://www.instagram.com/extra.timeorg',
  },
  {
    platform: 'tiktok',
    label: 'TikTok',
    handle: '@extra.timeorg',
    url: 'https://www.tiktok.com/@extra.timeorg',
  },
];

/** Header "Watch" call to action: the YouTube channel, where every full conversation lives. */
export const WATCH_URL = 'https://www.youtube.com/@extratimeorg';

/** Scroll offset (px) after which the header switches to its compact, translucent style. */
export const HEADER_COMPACT_SCROLL_Y = 24;

/** Returns the document title of a page: "{page} | ExtraTime". */
export function pageTitle(page: string): string {
  return `${page} | ${SITE_NAME}`;
}
