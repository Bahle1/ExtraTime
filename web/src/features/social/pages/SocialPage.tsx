import type { Platform, SocialFeedResponse } from '@extratime/shared';
import { PLATFORMS } from '@extratime/shared/constants';
import {
  keepPreviousData,
  useInfiniteQuery,
  type InfiniteData,
  type UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { useSearchParams } from 'react-router';
import { EmptyState } from '../../../components/feedback/EmptyState';
import { ErrorState } from '../../../components/feedback/ErrorState';
import { QueryContent } from '../../../components/feedback/QueryContent';
import { pageTitle, SITE_NAME } from '../../../components/layout/layout.constants';
import { SectionHeading } from '../../../components/ui/SectionHeading';
import ui from '../../../components/ui/ui.module.css';
import { formatPlatform } from '../../../lib/formatting/formatPlatform';
import { socialQueries } from '../../../lib/queries/socialQueries';
import { PlatformFilter } from '../components/PlatformFilter';
import { SocialFeed } from '../components/SocialFeed';
import styles from '../components/social.module.css';
import { PLATFORM_PARAM, SOCIAL_PAGE_LIMIT } from '../social.constants';

const PAGE_HEADING = 'Social';

type FeedQuery = UseInfiniteQueryResult<InfiniteData<SocialFeedResponse>>;

function parsePlatform(value: string | null): Platform | null {
  return PLATFORMS.find((platform) => platform === value) ?? null;
}

function LoadMore({ query }: { readonly query: FeedQuery }) {
  const loadMore = () => {
    if (!query.isFetchingNextPage) void query.fetchNextPage();
  };
  if (query.isFetchNextPageError) return <ErrorState error={query.error} onRetry={loadMore} />;
  if (!query.hasNextPage) return null;
  return (
    <button
      className={styles.loadMore}
      type="button"
      aria-disabled={query.isFetchingNextPage}
      onClick={loadMore}
    >
      {query.isFetchingNextPage ? 'Loading more posts…' : 'Load more'}
    </button>
  );
}

/** /social: the unified feed newest first, a ?platform filter and Load more on meta.nextCursor (LFR-19). */
export function SocialPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const platform = parsePlatform(searchParams.get(PLATFORM_PARAM));
  const feed = socialQueries.feed({ limit: SOCIAL_PAGE_LIMIT, platform: platform ?? undefined });
  const query = useInfiniteQuery({ ...feed, placeholderData: keepPreviousData });
  const filter = (next: Platform | null) =>
    setSearchParams(next === null ? {} : { [PLATFORM_PARAM]: next });
  return (
    <section className={ui.container}>
      <title>{pageTitle(PAGE_HEADING)}</title>
      <div className={styles.pageHeader}>
        <SectionHeading eyebrow="From the channels" lines={[PAGE_HEADING]} level={1} />
        <p className={ui.standfirst}>
          Clips, photos and conversation starters from {SITE_NAME}&apos;s channels.
        </p>
      </div>
      <div className={styles.pageBody}>
        <QueryContent query={query} loadingLabel="Loading posts">
          {({ pages }) => {
            const posts = pages.flatMap((page) => page.data);
            const sources = pages[0]?.meta.sources ?? [];
            return (
              <>
                <PlatformFilter value={platform} onChange={filter} sources={sources} />
                <h2 className={styles.resultsHeading}>
                  {platform === null ? 'Latest posts' : `Latest ${formatPlatform(platform)} posts`}
                </h2>
                {posts.length === 0 ? (
                  <EmptyState title="No posts to show yet" />
                ) : (
                  <SocialFeed posts={posts} busy={query.isPlaceholderData} />
                )}
              </>
            );
          }}
        </QueryContent>
        <LoadMore query={query} />
      </div>
    </section>
  );
}
