import { useEffect, useRef, type RefObject } from 'react';
import { Outlet, ScrollRestoration, useLocation } from 'react-router';
import { MAIN_CONTENT_ID } from '../components/layout/layout.constants';
import { SiteFooter } from '../components/layout/SiteFooter';
import { SiteHeader } from '../components/layout/SiteHeader';
import { SkipLink } from '../components/layout/SkipLink';
import styles from './RootLayout.module.css';

function useHeadingFocusOnNavigation(main: RefObject<HTMLElement | null>): void {
  const { pathname } = useLocation();
  const previousPathname = useRef(pathname);
  useEffect(() => {
    if (previousPathname.current === pathname) return;
    previousPathname.current = pathname;
    main.current?.querySelector('h1')?.focus();
  }, [main, pathname]);
}

/**
 * App shell that never unmounts (LFR-12); moves focus to the page h1 when the pathname changes.
 * Videos play inline in the page that holds them, so leaving a page stops playback.
 */
export function RootLayout() {
  const mainRef = useRef<HTMLElement>(null);
  useHeadingFocusOnNavigation(mainRef);
  return (
    <div className={styles.shell}>
      <ScrollRestoration />
      <SkipLink />
      <SiteHeader />
      <main className={styles.main} id={MAIN_CONTENT_ID} ref={mainRef} tabIndex={-1}>
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}
