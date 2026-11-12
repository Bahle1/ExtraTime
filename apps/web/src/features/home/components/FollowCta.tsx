import { useId } from 'react';
import {
  FOLLOW_LINKS,
  SITE_NAME,
  type FollowPlatform,
} from '../../../components/layout/layout.constants';
import { StackedLines } from '../../../components/ui/SectionHeading';
import ui from '../../../components/ui/ui.module.css';
import styles from './home.module.css';

const PLATFORM_GLYPHS: Readonly<Record<FollowPlatform, string>> = {
  youtube: '▶',
  instagram: '◎',
  tiktok: '♪',
};
const STATEMENT_LINES = ["Don't just watch.", 'Join the', 'conversation.'] as const;

/** Closing accent section: a giant statement and one large row per official profile (Filthy Fellas pattern). */
export function FollowCta() {
  const headingId = useId();
  return (
    <section className={styles.followSection} aria-labelledby={headingId}>
      <div className={`${ui.container} ${styles.followInner}`}>
        <div>
          <p className={styles.followEyebrow}>Follow the conversation</p>
          <h2 className={styles.followStatement} id={headingId}>
            <StackedLines lines={STATEMENT_LINES} />
          </h2>
        </div>
        <ul className={styles.followRows} aria-label={`Follow ${SITE_NAME} on`}>
          {FOLLOW_LINKS.map(({ platform, label, handle, url }) => (
            <li key={platform}>
              <a className={styles.followRow} href={url} target="_blank" rel="noopener noreferrer">
                <span className={styles.followGlyph} aria-hidden="true">
                  {PLATFORM_GLYPHS[platform]}
                </span>
                <span className={styles.followLabel}>{label}</span>
                <span className={styles.followHandle}>{handle}</span>
                <span aria-hidden="true">→</span>
                <span className={ui.visuallyHidden}> (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
