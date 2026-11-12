import type { EpisodeSummary } from '@extratime/shared';
import { useQuery } from '@tanstack/react-query';
import { useId } from 'react';
import { Link } from 'react-router';
import { ExternalLink } from '../../../components/ui/ExternalLink';
import { SectionHeading, StackedLines } from '../../../components/ui/SectionHeading';
import ui from '../../../components/ui/ui.module.css';
import { episodeQueries } from '../../../lib/queries/episodeQueries';
import { InlineVideo } from '../../player/components/InlineVideo';
import { FOLLOW_LINKS } from '../../../components/layout/layout.constants';
import { FEATURED_GUESTS, TABLE_GUESTS, type FeaturedGuest } from '../home.constants';
import styles from './home.module.css';

const INSTAGRAM_URL = FOLLOW_LINKS.find((link) => link.platform === 'instagram')?.url ?? '';

function GuestCard({
  guest,
  episode,
}: {
  readonly guest: FeaturedGuest;
  readonly episode: EpisodeSummary;
}) {
  const playerKey = useId();
  const video = episode.media.video;
  return (
    <article className={styles.guestCard}>
      <InlineVideo playerKey={playerKey} episode={episode} mono />
      <div className={styles.guestName} data-tone={guest.tone}>
        <p className={styles.guestLabel}>{guest.label}</p>
        <h3 className={styles.guestNameLines}>
          <StackedLines
            lines={guest.nameLines}
            accentLine={1}
            accentClassName={styles.guestNameAccent}
          />
        </h3>
      </div>
      <div className={styles.guestFooter}>
        <p className={styles.guestKicker}>Featured guest</p>
        <p className={styles.guestEpisode}>
          <Link to={`/episodes/${episode.slug}`}>{episode.title}</Link>
        </p>
        <p className={styles.guestSummary}>{episode.summary}</p>
        {video !== null && (
          <ExternalLink className={ui.textLink} href={video.watchUrl}>
            Watch on YouTube
          </ExternalLink>
        )}
      </div>
    </article>
  );
}

function TableGuests() {
  return (
    <div className={styles.tablePanel}>
      <p className={ui.label}>The people at our table</p>
      <ul className={ui.chipList}>
        {TABLE_GUESTS.map((name) => (
          <li key={name}>
            <Link className={ui.chip} to={`/episodes?q=${encodeURIComponent(name)}`}>
              {name}
            </Link>
          </li>
        ))}
      </ul>
      <ExternalLink className={ui.textLink} href={INSTAGRAM_URL}>
        More on Instagram
      </ExternalLink>
    </div>
  );
}

/** "At our table": featured-guest cards that play inline, then every guest as a search chip. */
export function GuestSpotlight() {
  const query = useQuery(episodeQueries.latest());
  const headingId = useId();
  const episodes = query.data?.data ?? [];
  const featured = FEATURED_GUESTS.flatMap((guest) => {
    const episode = episodes.find((candidate) => candidate.slug === guest.slug);
    return episode === undefined ? [] : [{ guest, episode }];
  });
  return (
    <section className={ui.paper} aria-labelledby={headingId}>
      <div className={`${ui.container} ${ui.section}`}>
        <div className={styles.sectionHeader}>
          <div>
            <SectionHeading
              id={headingId}
              eyebrow="Featured conversations"
              lines={['At our', 'table.']}
              accentLine={1}
            />
          </div>
          <p className={styles.sectionNote}>
            Coaches, players and creatives on what football teaches beyond the ninety minutes.
          </p>
        </div>
        <div className={styles.guestGrid}>
          {featured.map(({ guest, episode }) => (
            <GuestCard guest={guest} episode={episode} key={guest.slug} />
          ))}
        </div>
        <TableGuests />
      </div>
    </section>
  );
}
