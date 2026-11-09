import { useQuery } from '@tanstack/react-query';
import { EmptyState } from '../../../components/feedback/EmptyState';
import { QueryContent } from '../../../components/feedback/QueryContent';
import { pageTitle, SITE_NAME } from '../../../components/layout/layout.constants';
import { SectionHeading } from '../../../components/ui/SectionHeading';
import ui from '../../../components/ui/ui.module.css';
import { hostQueries } from '../../../lib/queries/hostQueries';
import { HostGrid } from '../components/HostGrid';
import styles from '../components/hosts.module.css';

/** /hosts: every host in editorial order (LFR-18). */
export function HostsPage() {
  const query = useQuery(hostQueries.list());
  return (
    <div className={ui.container}>
      <title>{pageTitle('Hosts')}</title>
      <div className={styles.pageHeader}>
        <SectionHeading
          eyebrow={`The faces of ${SITE_NAME}`}
          lines={['Meet the', 'hosts']}
          accentLine={1}
          level={1}
        />
        <p className={ui.standfirst}>
          The people behind {SITE_NAME} and the conversations they host.
        </p>
      </div>
      <div className={styles.pageBody}>
        <QueryContent query={query} loadingLabel="Loading hosts">
          {({ data }) =>
            data.length > 0 ? (
              <HostGrid hosts={data} />
            ) : (
              <EmptyState title="No hosts to show yet" />
            )
          }
        </QueryContent>
      </div>
    </div>
  );
}
