import { EpisodeCard, type TolerantEpisodeSummary } from './EpisodeCard';
import styles from './episodes.module.css';

/** Props of EpisodeList. */
export interface EpisodeListProps {
  /** Episodes in display order; an empty list renders nothing, so callers own EmptyState. */
  readonly episodes: readonly TolerantEpisodeSummary[];
}

/** Responsive grid of EpisodeCards: one, two, then three columns (§3.6.6). */
export function EpisodeList({ episodes }: EpisodeListProps) {
  if (episodes.length === 0) return null;
  return (
    <ul className={styles.list}>
      {episodes.map((episode) => (
        <li key={episode.id}>
          <EpisodeCard episode={episode} />
        </li>
      ))}
    </ul>
  );
}
