import type { EpisodeSummary } from '@extratime/shared';
import { useId, type ReactNode } from 'react';
import { Link } from 'react-router';
import { ExternalLink } from '../../../components/ui/ExternalLink';
import ui from '../../../components/ui/ui.module.css';
import { formatDate } from '../../../lib/formatting/formatDate';
import { formatDuration } from '../../../lib/formatting/formatDuration';
import { InlineVideo } from '../../player/components/InlineVideo';
import { PlayButton } from '../../player/components/PlayButton';
import type { PlayableEpisode } from '../../player/store/player.types';
import styles from './episodes.module.css';

const CODE_DIGITS = 2;
const EPISODE_TYPE_BADGES = new Map<string, string>([
  ['bonus', 'Special'],
  ['trailer', 'Trailer'],
]);

/** An EpisodeSummary as the browser reads it: episodeType may be newer than this build (LFR-14). */
export type TolerantEpisodeSummary = Omit<EpisodeSummary, 'episodeType'> & {
  readonly episodeType: string;
};

/** Props of EpisodeBadges. */
export type EpisodeBadgesProps = Pick<
  TolerantEpisodeSummary,
  'season' | 'episodeNumber' | 'episodeType'
>;

/** Props of EpisodeMeta. */
export type EpisodeMetaProps = Pick<EpisodeSummary, 'publishedAt' | 'durationSeconds'>;

/** Props of EpisodeActions. */
export interface EpisodeActionsProps {
  readonly episode: PlayableEpisode;
  /** Key of the InlineVideo a PlayButton controls; omit for no PlayButton. */
  readonly playerKey?: string;
  /** Further actions after the YouTube link, such as ShareButton. */
  readonly children?: ReactNode;
}

/** Props of EpisodeCard. */
export interface EpisodeCardProps {
  readonly episode: TolerantEpisodeSummary;
}

function episodeCode(season: number | null, episodeNumber: number | null): string | null {
  if (season === null || episodeNumber === null) return null;
  const pad = (value: number) => String(value).padStart(CODE_DIGITS, '0');
  return `S${pad(season)}E${pad(episodeNumber)}`;
}

/** Code badge (S01E02) when coded and a Special or Trailer badge; unknown types get none (LFR-14). */
export function EpisodeBadges({ season, episodeNumber, episodeType }: EpisodeBadgesProps) {
  const badges = [episodeCode(season, episodeNumber), EPISODE_TYPE_BADGES.get(episodeType)];
  const shown = badges.filter((badge) => badge !== null && badge !== undefined);
  if (shown.length === 0) return null;
  return (
    <ul className={styles.badges} aria-label="Episode labels">
      {shown.map((badge) => (
        <li className={styles.badge} key={badge}>
          {badge}
        </li>
      ))}
    </ul>
  );
}

/** Publication date and duration as machine-readable time elements. */
export function EpisodeMeta({ publishedAt, durationSeconds }: EpisodeMetaProps) {
  return (
    <p className={styles.meta}>
      <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
      <span aria-hidden="true"> · </span>
      <time dateTime={`PT${durationSeconds}S`}>{formatDuration(durationSeconds)}</time>
    </p>
  );
}

/** Action row on the hero and the episode page: optional PlayButton, "Watch on YouTube", then children. */
export function EpisodeActions({ episode, playerKey, children }: EpisodeActionsProps) {
  const video = episode.media.video;
  return (
    <div className={styles.actions}>
      {playerKey !== undefined && <PlayButton playerKey={playerKey} episode={episode} />}
      {video !== null && (
        <ExternalLink className={ui.buttonGhost} href={video.watchUrl}>
          Watch on YouTube
        </ExternalLink>
      )}
      {children}
    </div>
  );
}

/** Episode card: inline-playing artwork, labels, title link, date, duration, summary and links (LFR-16). */
export function EpisodeCard({ episode }: EpisodeCardProps) {
  const playerKey = useId();
  const video = episode.media.video;
  return (
    <article className={styles.card}>
      <InlineVideo playerKey={playerKey} episode={episode} />
      <div className={styles.cardBody}>
        <div className={styles.cardLabels}>
          <EpisodeBadges {...episode} />
          <EpisodeMeta {...episode} />
        </div>
        <h3 className={styles.cardTitle}>
          <Link to={`/episodes/${episode.slug}`}>{episode.title}</Link>
        </h3>
        <p className={styles.summary}>{episode.summary}</p>
        <div className={styles.cardLinks}>
          <Link
            className={ui.textLink}
            to={`/episodes/${episode.slug}`}
            aria-hidden="true"
            tabIndex={-1}
          >
            Explore episode →
          </Link>
          {video !== null && (
            <ExternalLink className={ui.textLink} href={video.watchUrl}>
              Watch on YouTube
            </ExternalLink>
          )}
        </div>
      </div>
    </article>
  );
}
