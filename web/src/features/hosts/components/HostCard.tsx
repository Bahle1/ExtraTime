import type { Host } from '@extratime/shared';
import { Link } from 'react-router';
import ui from '../../../components/ui/ui.module.css';
import { HostAvatar } from './HostAvatar';
import styles from './hosts.module.css';

/** Props of HostCard. */
export interface HostCardProps {
  readonly host: Host;
}

/** Directory card: monogram or portrait, role, name linking to the profile and short bio (LFR-18). */
export function HostCard({ host }: HostCardProps) {
  return (
    <article className={styles.card}>
      <HostAvatar name={host.name} avatar={host.avatar} size="large" />
      <div className={styles.cardBody}>
        <p className={ui.label}>{host.role}</p>
        <h2 className={styles.cardName}>
          <Link to={`/hosts/${host.slug}`}>{host.name}</Link>
        </h2>
        <p className={styles.shortBio}>{host.shortBio}</p>
        <Link className={ui.textLink} to={`/hosts/${host.slug}`} aria-hidden="true" tabIndex={-1}>
          View profile →
        </Link>
      </div>
    </article>
  );
}
