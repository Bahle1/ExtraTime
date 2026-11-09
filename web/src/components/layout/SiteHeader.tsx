import { useEffect, useId, useState } from 'react';
import { Link, useLocation } from 'react-router';
import buttons from '../ui/ui.module.css';
import { ExternalLink } from '../ui/ExternalLink';
import { PrimaryNav } from './PrimaryNav';
import { FollowLinks } from './SiteFooter';
import { HEADER_COMPACT_SCROLL_Y, SITE_NAME, WATCH_URL } from './layout.constants';
import styles from './layout.module.css';

function useScrolledPast(offset: number): boolean {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > offset);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [offset]);
  return scrolled;
}

function useMobileMenu() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return undefined;
    const closeOnEscape = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [open]);
  return { open, toggle: () => setOpen((value) => !value), close: () => setOpen(false) };
}

/**
 * Banner landmark on every page: wordmark, primary navigation and the "Watch" call to action;
 * compact and translucent once scrolled, with a full-screen menu below 960 px (LFR-20).
 */
export function SiteHeader() {
  const scrolled = useScrolledPast(HEADER_COMPACT_SCROLL_Y);
  const menu = useMobileMenu();
  const menuId = useId();
  return (
    <header className={styles.header} data-compact={scrolled ? '' : undefined}>
      <div className={styles.headerInner}>
        <Link className={styles.wordmark} to="/">
          {SITE_NAME}
        </Link>
        <PrimaryNav />
        <ExternalLink className={`${buttons.buttonPrimary} ${styles.watch}`} href={WATCH_URL}>
          <span aria-hidden="true">▶</span> Watch
        </ExternalLink>
        <button
          className={styles.menuButton}
          type="button"
          aria-expanded={menu.open}
          aria-controls={menuId}
          onClick={menu.toggle}
        >
          {menu.open ? 'Close' : 'Menu'}
        </button>
      </div>
      {menu.open && (
        <div className={styles.mobileMenu} id={menuId}>
          <PrimaryNav variant="menu" onNavigate={menu.close} />
          <FollowLinks />
        </div>
      )}
    </header>
  );
}
