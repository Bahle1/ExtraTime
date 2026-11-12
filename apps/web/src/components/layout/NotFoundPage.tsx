import { Link } from 'react-router';
import buttons from '../ui/ui.module.css';
import { SectionHeading } from '../ui/SectionHeading';
import { pageTitle } from './layout.constants';
import styles from './layout.module.css';

/** In-layout 404 for unknown paths and slugs; asks search engines not to index it (LFR-12). */
export function NotFoundPage() {
  return (
    <section className={styles.notFound}>
      <title>{pageTitle('Page not found')}</title>
      <meta name="robots" content="noindex" />
      <SectionHeading
        eyebrow="404 · Off the pitch"
        lines={['Page', 'not found']}
        accentLine={1}
        level={1}
      />
      <p className={styles.notFoundText}>
        We couldn&apos;t find that page. The link may be mistyped, or the page may have moved.
      </p>
      <div className={styles.notFoundActions}>
        <Link className={buttons.buttonPrimary} to="/episodes">
          Browse every episode
        </Link>
        <Link className={buttons.buttonGhost} to="/">
          Go to the home page
        </Link>
      </div>
    </section>
  );
}
