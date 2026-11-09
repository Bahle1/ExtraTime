import type { Guest } from '@extratime/shared';
import { Link } from 'react-router';
import ui from '../../../components/ui/ui.module.css';
import styles from './episodes.module.css';

/** Props of GuestList. */
export interface GuestListProps {
  readonly guests: readonly Guest[];
}

/** Guests as chips that search the archive for each name; renders nothing when there are none (LFR-14). */
export function GuestList({ guests }: GuestListProps) {
  if (guests.length === 0) return null;
  return (
    <section className={styles.guestsBlock}>
      <h2 className={styles.blockLabel}>At the table</h2>
      <ul className={ui.chipList}>
        {guests.map((guest) => (
          <li key={guest.name}>
            <Link className={ui.chip} to={`/episodes?q=${encodeURIComponent(guest.name)}`}>
              {guest.name}
              {guest.description !== null && (
                <span className={styles.guestRole}>&nbsp;· {guest.description}</span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
