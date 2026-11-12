import type { Host } from '@extratime/shared';
import { HostCard } from './HostCard';
import styles from './hosts.module.css';

/** Props of HostGrid. */
export interface HostGridProps {
  /** Hosts in editorial order. */
  readonly hosts: readonly Host[];
}

/** Responsive grid of HostCards in editorial order (LFR-18). */
export function HostGrid({ hosts }: HostGridProps) {
  return (
    <ul className={styles.grid}>
      {hosts.map((host) => (
        <li key={host.id}>
          <HostCard host={host} />
        </li>
      ))}
    </ul>
  );
}
