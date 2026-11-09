import type { Host, HostDetail } from '@extratime/shared';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';
import { QueryContent } from '../../../components/feedback/QueryContent';
import { NotFoundPage } from '../../../components/layout/NotFoundPage';
import { pageTitle } from '../../../components/layout/layout.constants';
import { ExternalLink } from '../../../components/ui/ExternalLink';
import { ShareButton } from '../../../components/ui/ShareButton';
import ui from '../../../components/ui/ui.module.css';
import { isNotFoundError } from '../../../lib/api/ApiError';
import { formatPlatform } from '../../../lib/formatting/formatPlatform';
import { hostQueries } from '../../../lib/queries/hostQueries';
import { EpisodeList } from '../../episodes/components/EpisodeList';
import { HostAvatar } from '../components/HostAvatar';
import styles from '../components/hosts.module.css';

const FALLBACK_HEADING = 'Host';

function SocialLinks({ host }: { readonly host: Pick<Host, 'name' | 'socialLinks'> }) {
  if (host.socialLinks.length === 0) return null;
  return (
    <ul className={ui.chipList} aria-label={`Follow ${host.name}`}>
      {host.socialLinks.map((link) => (
        <li key={link.url}>
          <ExternalLink className={ui.chip} href={link.url}>
            {formatPlatform(link.platform)} @{link.handle}
          </ExternalLink>
        </li>
      ))}
    </ul>
  );
}

function HostProfile({ host }: { readonly host: HostDetail }) {
  return (
    <>
      <div className={styles.profileBody}>
        <p className={ui.standfirst}>{host.shortBio}</p>
        <div>
          {host.favoriteClub !== null && <p>Favourite club: {host.favoriteClub}</p>}
          <p className={styles.bio}>{host.bio}</p>
          <div className={styles.profileActions}>
            <SocialLinks host={host} />
            <ShareButton path={`/hosts/${host.slug}`} title={host.name} />
          </div>
        </div>
      </div>
      {host.recentEpisodes.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.blockLabel}>Conversations with {host.name}</h2>
          <EpisodeList episodes={host.recentEpisodes} />
        </section>
      )}
    </>
  );
}

/** /hosts/:slug: monogram or portrait, role, bio, links, share and up to 6 recent episodes (LFR-18). */
export function HostDetailPage() {
  const { slug = '' } = useParams();
  const query = useQuery(hostQueries.detail(slug));
  if (isNotFoundError(query.error)) return <NotFoundPage />;
  const host = query.data?.data;
  return (
    <article className={ui.container}>
      <title>{pageTitle(host?.name ?? FALLBACK_HEADING)}</title>
      <div className={styles.profileHeader}>
        {host !== undefined && <HostAvatar name={host.name} avatar={host.avatar} size="large" />}
        <div>
          {host !== undefined && <p className={ui.eyebrow}>{host.role}</p>}
          <h1 tabIndex={-1}>{host?.name ?? FALLBACK_HEADING}</h1>
        </div>
      </div>
      <QueryContent query={query} loadingLabel="Loading host">
        {({ data }) => <HostProfile host={data} />}
      </QueryContent>
    </article>
  );
}
