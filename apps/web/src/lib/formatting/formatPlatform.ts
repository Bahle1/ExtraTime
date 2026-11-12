import type { Platform } from '@extratime/shared';

const PLATFORM_NAMES = {
  youtube: 'YouTube',
  instagram: 'Instagram',
  facebook: 'Facebook',
} as const satisfies Record<Platform, string>;
const PLATFORM_LABELS = new Map<string, string>(Object.entries(PLATFORM_NAMES));
const UNKNOWN_PLATFORM_LABEL = 'Social media';

/** Display name of a platform; values newer than this build get a neutral label (LFR-14). */
export function formatPlatform(platform: string): string {
  return PLATFORM_LABELS.get(platform) ?? UNKNOWN_PLATFORM_LABEL;
}
