import { useQuery } from '@tanstack/react-query';
import { useId } from 'react';
import { Link } from 'react-router';
import { QueryContent } from '../../../components/feedback/QueryContent';
import { Carousel } from '../../../components/ui/Carousel';
import { SectionHeading } from '../../../components/ui/SectionHeading';
import ui from '../../../components/ui/ui.module.css';
import { episodeQueries } from '../../../lib/queries/episodeQueries';
import { EpisodeCard } from '../../episodes/components/EpisodeCard';
import { RAIL_SIZE } from '../home.constants';
import styles from './home.module.css';

const FIRST_RAIL_INDEX = 1;

/** Carousel of the RAIL_SIZE episodes after the hero; each card plays inline (LFR-15). */
export function LatestEpisodesRail() {
  const query = useQuery(episodeQueries.latest());
  const headingId = useId();
  return (
    <section className={styles.railSection} aria-labelledby={headingId}>
      <div className={ui.container}>
        <div className={styles.sectionHeader}>
          <div>
            <SectionHeading
              id={headingId}
              eyebrow="Watch the conversations"
              lines={['The latest', 'conversations.']}
              accentLine={1}
            />
          </div>
          <Link className={ui.textLink} to="/episodes">
            All episodes →
          </Link>
        </div>
        <QueryContent query={query} loadingLabel="Loading episodes">
          {({ data }) => (
            <Carousel label="Latest conversations">
              {data.slice(FIRST_RAIL_INDEX, FIRST_RAIL_INDEX + RAIL_SIZE).map((episode) => (
                <li key={episode.id}>
                  <EpisodeCard episode={episode} />
                </li>
              ))}
            </Carousel>
          )}
        </QueryContent>
      </div>
    </section>
  );
}
