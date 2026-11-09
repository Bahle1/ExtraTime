import type { EpisodeListResponse } from '@extratime/shared';
import { MAX_QUERY_LENGTH } from '@extratime/shared/constants';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useId, useRef, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router';
import { EmptyState } from '../../../components/feedback/EmptyState';
import { QueryContent } from '../../../components/feedback/QueryContent';
import { pageTitle } from '../../../components/layout/layout.constants';
import { SectionHeading } from '../../../components/ui/SectionHeading';
import ui from '../../../components/ui/ui.module.css';
import { episodeQueries } from '../../../lib/queries/episodeQueries';
import { EpisodeList } from '../components/EpisodeList';
import styles from '../components/episodes.module.css';

const PAGE_TITLE = 'Episodes';
const SEARCH_PARAM = 'q';

interface EpisodeSearchProps {
  readonly query: string;
  readonly onSearch: (query: string) => void;
}

function useSearchFieldSync(query: string) {
  const fieldRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const field = fieldRef.current;
    if (field !== null && field.value.trim() !== query) field.value = query;
  }, [query]);
  return fieldRef;
}

function EpisodeSearch({ query, onSearch }: EpisodeSearchProps) {
  const inputId = useId();
  const fieldRef = useSearchFieldSync(query);
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = new FormData(event.currentTarget).get(SEARCH_PARAM);
    onSearch(typeof value === 'string' ? value.trim() : '');
  };
  return (
    <form className={styles.search} role="search" onSubmit={handleSubmit}>
      <label className={ui.label} htmlFor={inputId}>
        Search episodes
      </label>
      <div className={styles.searchRow}>
        <input
          className={styles.searchInput}
          id={inputId}
          name={SEARCH_PARAM}
          type="search"
          ref={fieldRef}
          defaultValue={query}
          maxLength={MAX_QUERY_LENGTH}
          placeholder="Guest, topic or title"
        />
        <button className={styles.searchButton} type="submit">
          Search
        </button>
      </div>
    </form>
  );
}

function countLabel(response: EpisodeListResponse): string {
  const total = response.meta.totalItems;
  return `${total} ${total === 1 ? 'conversation' : 'conversations'}`;
}

function EpisodeResults({ q }: { readonly q: string | undefined }) {
  const query = useQuery(episodeQueries.list({ q }));
  return (
    <section className={styles.results}>
      <div className={styles.resultsHeader}>
        <h2 className={styles.blockLabel}>
          {q === undefined ? 'All episodes' : `Results for “${q}”`}
        </h2>
        {query.data !== undefined && <p className={ui.label}>{countLabel(query.data)}</p>}
      </div>
      <QueryContent query={query} loadingLabel="Loading episodes">
        {({ data }) =>
          data.length > 0 ? (
            <EpisodeList episodes={data} />
          ) : (
            <EmptyState title={q === undefined ? 'No episodes yet' : `No episodes match “${q}”`}>
              {q !== undefined && (
                <p>
                  <Link to="/episodes">Show all episodes</Link>
                </p>
              )}
            </EmptyState>
          )
        }
      </QueryContent>
    </section>
  );
}

/** /episodes: the archive newest first, searched on Enter through ?q (LFR-16). */
export function EpisodesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get(SEARCH_PARAM)?.trim() ?? '';
  const search = (value: string) => setSearchParams(value === '' ? {} : { [SEARCH_PARAM]: value });
  return (
    <div className={ui.container}>
      <title>{pageTitle(PAGE_TITLE)}</title>
      <div className={styles.pageHeader}>
        <div>
          <SectionHeading eyebrow="The archive" lines={[PAGE_TITLE]} level={1} />
          <p className={ui.standfirst}>Real conversations. The whole story.</p>
        </div>
        <EpisodeSearch query={q} onSearch={search} />
      </div>
      <EpisodeResults q={q === '' ? undefined : q} />
    </div>
  );
}
