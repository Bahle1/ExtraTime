import { useInfiniteQuery } from '@tanstack/react-query';
import { useId } from 'react';
import { Link } from 'react-router';
import { EmptyState } from '../../../components/feedback/EmptyState';
import { QueryContent } from '../../../components/feedback/QueryContent';
import { Carousel } from '../../../components/ui/Carousel';
import { SectionHeading } from '../../../components/ui/SectionHeading';
import ui from '../../../components/ui/ui.module.css';
import { socialQueries } from '../../../lib/queries/socialQueries';
import { SocialPostCard } from '../../social/components/SocialPostCard';
import { SOCIAL_PAGE_LIMIT } from '../../social/social.constants';
import { SOCIAL_HIGHLIGHTS_COUNT } from '../home.constants';
import styles from './home.module.css';

/** The newest posts as a numbered carousel, sharing SocialPage's first cache entry (LFR-15). */
export function SocialHighlights() {
  const query = useInfiniteQuery(socialQueries.feed({ limit: SOCIAL_PAGE_LIMIT }));
  const headingId = useId();
  return (
    <section className={styles.railSection} aria-labelledby={headingId}>
      <div className={ui.container}>
        <div className={styles.sectionHeader}>
          <div>
            <SectionHeading
              id={headingId}
              eyebrow="From the socials"
              lines={['Moments from', 'the conversation.']}
              accentLine={1}
            />
          </div>
          <Link className={ui.textLink} to="/social">
            Every post →
          </Link>
        </div>
        <QueryContent query={query} loadingLabel="Loading social posts">
          {({ pages: [firstPage] }) => {
            const posts = firstPage?.data.slice(0, SOCIAL_HIGHLIGHTS_COUNT) ?? [];
            if (posts.length === 0) return <EmptyState title="No social posts yet" />;
            return (
              <Carousel label="Social posts">
                {posts.map((post, index) => (
                  <li key={post.id}>
                    <SocialPostCard
                      post={post}
                      position={{ index: index + 1, total: posts.length }}
                    />
                  </li>
                ))}
              </Carousel>
            );
          }}
        </QueryContent>
      </div>
    </section>
  );
}
