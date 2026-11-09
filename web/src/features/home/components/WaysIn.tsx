import type { EpisodeSummary } from '@extratime/shared';
import { useQuery } from '@tanstack/react-query';
import { useId } from 'react';
import { Link } from 'react-router';
import { ArtworkImage } from '../../../components/ui/ArtworkImage';
import { SectionHeading } from '../../../components/ui/SectionHeading';
import ui from '../../../components/ui/ui.module.css';
import { episodeQueries } from '../../../lib/queries/episodeQueries';
import { WAYS_IN, type WayIn } from '../home.constants';
import styles from './home.module.css';

function WayInTile({
  way,
  episodes,
}: {
  readonly way: WayIn;
  readonly episodes: readonly EpisodeSummary[];
}) {
  const artwork = episodes.find((episode) => episode.slug === way.artworkSlug)?.artwork;
  return (
    <li className={styles.wayTile} data-tone={way.tone}>
      {way.tone === 'photo' && artwork !== undefined && (
        <div className={styles.wayPhoto}>
          <ArtworkImage image={{ ...artwork, alt: '' }} fill />
        </div>
      )}
      <p className={styles.wayNumber}>{way.number}</p>
      <div className={styles.wayBody}>
        <h3 className={styles.wayTitle}>{way.title}</h3>
        <p className={styles.wayMeta}>{way.meta}</p>
        <Link className={styles.wayLink} to={way.to}>
          {way.linkLabel} →
        </Link>
      </div>
    </li>
  );
}

/** Three colour-blocked editorial routes into the archive (Filthy Fellas "shows" pattern). */
export function WaysIn() {
  const query = useQuery(episodeQueries.latest());
  const headingId = useId();
  const episodes = query.data?.data ?? [];
  return (
    <section className={styles.waysSection} aria-labelledby={headingId}>
      <div className={`${ui.container} ${styles.waysHeader}`}>
        <SectionHeading
          id={headingId}
          eyebrow="Ways in"
          lines={['Three ways into', 'the conversation.']}
          accentLine={1}
        />
      </div>
      <ul className={styles.ways}>
        {WAYS_IN.map((way) => (
          <WayInTile way={way} episodes={episodes} key={way.number} />
        ))}
      </ul>
    </section>
  );
}
