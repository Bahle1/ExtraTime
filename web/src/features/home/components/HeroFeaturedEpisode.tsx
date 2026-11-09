import type { EpisodeSummary } from '@extratime/shared';
import { useQuery } from '@tanstack/react-query';
import { useId } from 'react';
import { Link } from 'react-router';
import { ErrorState } from '../../../components/feedback/ErrorState';
import { StackedLines } from '../../../components/ui/SectionHeading';
import ui from '../../../components/ui/ui.module.css';
import { formatDate } from '../../../lib/formatting/formatDate';
import { episodeQueries } from '../../../lib/queries/episodeQueries';
import { InlineVideo } from '../../player/components/InlineVideo';
import { PlayButton } from '../../player/components/PlayButton';
import { usePlayerStore } from '../../player/store/playerStore';
import { HERO_COPY } from '../home.constants';
import styles from './home.module.css';

function HeroHeading({ id }: { readonly id: string }) {
  return (
    <h1 className={styles.heroTitle} id={id} tabIndex={-1}>
      <StackedLines lines={HERO_COPY.headingLines} accentLine={HERO_COPY.accentLine} />
    </h1>
  );
}

function HeroActions({
  episode,
  playerKey,
}: {
  readonly episode: EpisodeSummary | undefined;
  readonly playerKey: string;
}) {
  return (
    <div className={styles.heroActions}>
      {episode !== undefined && (
        <PlayButton playerKey={playerKey} episode={episode} text="Play latest" />
      )}
      <Link className={ui.textLink} to="/episodes">
        Explore episodes →
      </Link>
    </div>
  );
}

/**
 * Full-height hero: slogan headline and actions on the left, the newest episode in a black-and-white
 * panel on the right that plays inline (LFR-15, no floating player).
 */
export function HeroFeaturedEpisode() {
  const query = useQuery(episodeQueries.latest());
  const headingId = useId();
  const playerKey = useId();
  const newest = query.data?.data[0];
  const isPlaying = usePlayerStore((state) => state.activeKey === playerKey);
  return (
    <section className={styles.hero} aria-labelledby={headingId}>
      <div className={styles.heroMedia}>
        {newest !== undefined && (
          <InlineVideo playerKey={playerKey} episode={newest} priority mono />
        )}
      </div>
      <div className={styles.heroCopy}>
        <p className={ui.eyebrow}>{HERO_COPY.eyebrow}</p>
        <HeroHeading id={headingId} />
        <p className={styles.heroStandfirst}>{HERO_COPY.standfirst}</p>
        <HeroActions episode={newest} playerKey={playerKey} />
        {query.error !== null && query.data === undefined && (
          <ErrorState error={query.error} onRetry={() => void query.refetch()} />
        )}
      </div>
      {newest !== undefined && !isPlaying && (
        <p className={styles.heroBadge}>
          <span>Latest</span>
          <Link to={`/episodes/${newest.slug}`}>{newest.title}</Link>
          <time dateTime={newest.publishedAt}>{formatDate(newest.publishedAt)}</time>
        </p>
      )}
    </section>
  );
}
