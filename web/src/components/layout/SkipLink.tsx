import { MAIN_CONTENT_ID } from './layout.constants';
import styles from './layout.module.css';

/** First focusable element on every page; jumps keyboard users past the header to `main`. */
export function SkipLink() {
  return (
    <a className={styles.skipLink} href={`#${MAIN_CONTENT_ID}`}>
      Skip to main content
    </a>
  );
}
