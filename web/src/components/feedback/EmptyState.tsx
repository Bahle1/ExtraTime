import type { ReactNode } from 'react';
import { FollowLinks } from '../layout/SiteFooter';
import styles from './feedback.module.css';

/** Props of EmptyState. */
export interface EmptyStateProps {
  readonly title: string;
  /** Optional guidance, such as a link that clears the search. */
  readonly children?: ReactNode;
}

/** Shown when a list has no items; always offers the follow links (LFR-14). */
export function EmptyState({ title, children }: EmptyStateProps) {
  return (
    <div className={styles.empty}>
      <p className={styles.title}>{title}</p>
      {children}
      <p>Catch the latest conversations on:</p>
      <FollowLinks />
    </div>
  );
}
