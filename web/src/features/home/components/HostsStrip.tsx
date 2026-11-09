import type { Host } from '@extratime/shared';
import { useQuery } from '@tanstack/react-query';
import { useId } from 'react';
import { Link } from 'react-router';
import { EmptyState } from '../../../components/feedback/EmptyState';
import { QueryContent } from '../../../components/feedback/QueryContent';
import { SectionHeading } from '../../../components/ui/SectionHeading';
import ui from '../../../components/ui/ui.module.css';
import { hostQueries } from '../../../lib/queries/hostQueries';
import { HostAvatar } from '../../hosts/components/HostAvatar';
import styles from './home.module.css';

function FounderCards({ hosts }: { readonly hosts: readonly Host[] }) {
  if (hosts.length === 0) return <EmptyState title="Meet the hosts soon" />;
  return (
    <>
      <p className={styles.names}>{hosts.map((host) => host.name).join(' · ')}</p>
      <ul className={styles.founders}>
        {hosts.map((host) => (
          <li className={styles.founder} key={host.id}>
            <HostAvatar name={host.name} avatar={host.avatar} size="large" />
            <div className={styles.founderBody}>
              <p className={ui.label}>{host.role}</p>
              <h3 className={styles.founderName}>
                <Link to={`/hosts/${host.slug}`}>{host.name}</Link>
              </h3>
              <p className={styles.founderBio}>{host.shortBio}</p>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

/** "Meet the founders": every host linking to their profile (LFR-15, Filthy Fellas cast pattern). */
export function HostsStrip() {
  const query = useQuery(hostQueries.list());
  const headingId = useId();
  return (
    <section className={`${ui.container} ${ui.section}`} aria-labelledby={headingId}>
      <div className={styles.sectionHeader}>
        <div>
          <SectionHeading
            id={headingId}
            eyebrow="The faces of ExtraTime"
            lines={['Meet the', 'founders.']}
            accentLine={1}
          />
        </div>
        <Link className={ui.textLink} to="/hosts">
          All hosts →
        </Link>
      </div>
      <QueryContent query={query} loadingLabel="Loading hosts">
        {({ data }) => <FounderCards hosts={data} />}
      </QueryContent>
    </section>
  );
}
