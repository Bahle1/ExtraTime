import type { EpisodeSummary } from '@extratime/shared';

/** Episode fields a player needs; a projection of EpisodeSummary. */
export type PlayableEpisode = Pick<EpisodeSummary, 'id' | 'slug' | 'title' | 'artwork' | 'media'>;

/**
 * Inline playback state: at most one InlineVideo plays at a time, identified by the key of the
 * widget it sits in (hero, card, panel). There is no floating player.
 */
export interface PlayerStore {
  /** Key of the widget playing now, or null. */
  readonly activeKey: string | null;
  /** Plays in the widget with this key; any other widget stops. */
  readonly play: (key: string) => void;
  /** Stops playback; with a key, only when that widget is the one playing. */
  readonly stop: (key?: string) => void;
}
