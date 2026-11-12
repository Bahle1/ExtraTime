import { NavLink } from 'react-router';
import { PRIMARY_NAV_ITEMS } from './layout.constants';
import styles from './layout.module.css';

/** Props of PrimaryNav. */
export interface PrimaryNavProps {
  /** 'bar' in the desktop header; 'menu' in the full-screen mobile menu. */
  readonly variant?: 'bar' | 'menu';
  /** Called after a link is chosen, so the mobile menu can close. */
  readonly onNavigate?: () => void;
}

/** Navigation landmark; NavLink marks the current section with aria-current="page". */
export function PrimaryNav({ variant = 'bar', onNavigate }: PrimaryNavProps) {
  return (
    <nav
      className={styles.nav}
      data-variant={variant}
      aria-label={variant === 'bar' ? 'Primary' : 'Menu'}
    >
      <ul className={styles.navList}>
        {PRIMARY_NAV_ITEMS.map(({ to, label }) => (
          <li key={to}>
            <NavLink className={styles.navLink} to={to} onClick={onNavigate}>
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
