import type { ReactNode } from 'react';
import styles from './ui.module.css';

/** Props of ExternalLink. */
export interface ExternalLinkProps {
  readonly href: string;
  readonly children: ReactNode;
  readonly className?: string;
}

/** Link to another site in a new tab, without opener or referrer (§3.6.5); announces the new tab. */
export function ExternalLink({ href, children, className }: ExternalLinkProps) {
  return (
    <a className={className} href={href} target="_blank" rel="noopener noreferrer">
      {children}
      <span className={styles.visuallyHidden}> (opens in a new tab)</span>
    </a>
  );
}
