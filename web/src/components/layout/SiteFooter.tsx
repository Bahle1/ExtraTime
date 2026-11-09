import { useId } from 'react';
import { Link } from 'react-router';
import { FOLLOW_LINKS, PRIMARY_NAV_ITEMS, SITE_NAME, SITE_SLOGAN } from './layout.constants';
import styles from './layout.module.css';

const COPYRIGHT_YEAR = 2026;

/** Named links to ExtraTIME's YouTube, Instagram and TikTok profiles, opening in a new tab. */
export function FollowLinks() {
  return (
    <ul className={styles.followList} aria-label={`Follow ${SITE_NAME}`}>
      {FOLLOW_LINKS.map(({ platform, label, handle, url }) => (
        <li key={platform}>
          <a className={styles.followLink} href={url} target="_blank" rel="noopener noreferrer">
            {label} <span className={styles.handle}>{handle}</span>
            <span className={styles.visuallyHidden}> (opens in a new tab)</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

/** Content-info landmark on every page: wordmark, slogan, explore links and follow links (LFR-20). */
export function SiteFooter() {
  const exploreId = useId();
  const followId = useId();
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerBrandBlock}>
          <p className={styles.footerBrand}>{SITE_NAME}</p>
          <p className={styles.footerSlogan}>{SITE_SLOGAN}.</p>
          <p className={styles.footerLabel}>Football · Identity · Purpose · Life</p>
        </div>
        <nav aria-labelledby={exploreId}>
          <h2 className={styles.footerHeading} id={exploreId}>
            Explore
          </h2>
          <ul className={styles.footerNavList}>
            {PRIMARY_NAV_ITEMS.filter(({ to }) => to !== '/about').map(({ to, label }) => (
              <li key={to}>
                <Link className={styles.footerLink} to={to}>
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <Link className={styles.footerLink} to="/about">
                About {SITE_NAME}
              </Link>
            </li>
          </ul>
        </nav>
        <section aria-labelledby={followId}>
          <h2 className={styles.footerHeading} id={followId}>
            Follow {SITE_NAME}
          </h2>
          <FollowLinks />
        </section>
      </div>
      <div className={styles.footerBar}>
        <p>
          © {COPYRIGHT_YEAR} {SITE_NAME}
        </p>
        <p>{SITE_SLOGAN}</p>
      </div>
    </footer>
  );
}
