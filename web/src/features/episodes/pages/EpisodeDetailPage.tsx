import type { Episode, EpisodeSummary, HostSummary } from '@extratime/shared';
import { useQuery } from '@tanstack/react-query';
import { useId } from 'react';
import { Link, useParams } from 'react-router';
import { QueryContent } from '../../../components/feedback/QueryContent';
import { NotFoundPage } from '../../../components/layout/NotFoundPage';
import { pageTitle } from '../../../components/layout/layout.constants';
import { Carousel } from '../../../components/ui/Carousel';
import { ShareButton } from '../../../components/ui/ShareButton';
import ui from '../../../components/ui/ui.module.css';
import { isNotFoundError } from '../../../lib/api/ApiError';
import { episodeQueries, LATEST_EPISODES_COUNT } from '../../../lib/queries/episodeQueries';
import { InlineVideo } from '../../player/components/InlineVideo';
import { EpisodeActions, EpisodeBadges, EpisodeCard, EpisodeMeta } from '../components/EpisodeCard';
import { GuestList } from '../components/GuestList';
import styles from '../components/episodes.module.css';

const FALLBACK_HEADING = 'Episode';
const MORE_EPISODES_LIMIT = LATEST_EPISODES_COUNT - 1;

function HostLinks({ hosts }: { readonly hosts: readonly HostSummary[] }) {
  if (hosts.length === 0) return null;
  return (
    <div className={styles.hostLine}>
      <span className={ui.label}>With</span>
      <ul className={styles.hostLinks} aria-label="Hosts">
        {hosts.map((host) => (
          <li key={host.id}>
            <Link to={`/hosts/${host.slug}`}>{host.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function EpisodeOverview({
  episode,
  playerKey,
}: {
  readonly episode: Episode;
  readonly playerKey: string;
}) {
  return (
    <>
      <div className={styles.cardLabels}>
        <EpisodeBadges {...episode} />
        <EpisodeMeta {...episode} />
      </div>
      <HostLinks hosts={episode.hosts} />
      <EpisodeActions episode={episode} playerKey={playerKey}>
        <ShareButton path={`/episodes/${episode.slug}`} title={episode.title} />
      </EpisodeActions>
    </>
  );
}

function MoreEpisodes({ currentSlug }: { readonly currentSlug: string }) {
  const query = useQuery(episodeQueries.latest());
  const others = (episodes: readonly EpisodeSummary[]) =>
    episodes.filter((episode) => episode.slug !== currentSlug).slice(0, MORE_EPISODES_LIMIT);
  return (
    <section className={styles.moreBlock}>
      <div className={styles.resultsHeader}>
        <h2>More conversations</h2>
        <Link className={ui.textLink} to="/episodes">
          Browse every episode →
        </Link>
      </div>
      <QueryContent query={query} loadingLabel="Loading more episodes">
        {({ data }) => (
          <Carousel label="More conversations">
            {others(data).map((episode) => (
              <li key={episode.id}>
                <EpisodeCard episode={episode} />
              </li>
            ))}
          </Carousel>
        )}
      </QueryContent>
    </section>
  );
}

function AboutEpisode({ episode }: { readonly episode: Episode }) {
  return (
    <section className={styles.aboutBlock}>
      <h2 className={styles.blockLabel}>About this episode</h2>
      <div className={styles.aboutGrid}>
        <p className={ui.standfirst}>{episode.summary}</p>
        <p className={styles.description}>{episode.description}</p>
      </div>
      <GuestList guests={episode.guests} />
    </section>
  );
}

/** /episodes/:slug: split hero with an inline video panel, play, share, show notes, guests and more episodes (LFR-17). */
export function EpisodeDetailPage() {
  const { slug = '' } = useParams();
  const playerKey = useId();
  const query = useQuery(episodeQueries.detail(slug));
  if (isNotFoundError(query.error)) return <NotFoundPage />;
  const episode = query.data?.data;
  return (
    <article className={ui.container}>
      <title>{pageTitle(episode?.title ?? FALLBACK_HEADING)}</title>
      <div className={styles.detailHero}>
        <div className={styles.detailIntro}>
          <p className={ui.eyebrow}>Episode</p>
          <h1 className={styles.detailTitle} tabIndex={-1}>
            {episode?.title ?? FALLBACK_HEADING}
          </h1>
          <QueryContent query={query} loadingLabel="Loading episode">
            {({ data }) => <EpisodeOverview episode={data} playerKey={playerKey} />}
          </QueryContent>
        </div>
        {episode !== undefined && (
          <div className={styles.detailMedia}>
            <InlineVideo playerKey={playerKey} episode={episode} priority />
          </div>
        )}
      </div>
      {episode !== undefined && <AboutEpisode episode={episode} />}
      <MoreEpisodes currentSlug={slug} />
    </article>
  );
}
