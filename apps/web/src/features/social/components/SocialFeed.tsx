import type { SocialPost } from '@extratime/shared';
import { SocialPostCard } from './SocialPostCard';
import styles from './social.module.css';

/** Props of SocialFeed. */
export interface SocialFeedProps {
  /** Posts newest first, as the API serves them. */
  readonly posts: readonly SocialPost[];
  /** True while placeholder posts from the previous filter show (aria-busy). */
  readonly busy?: boolean;
}

/** Responsive grid of SocialPostCards; links to originals only, no Meta scripts (LFR-19). */
export function SocialFeed({ posts, busy = false }: SocialFeedProps) {
  return (
    <ul className={styles.feed} aria-busy={busy}>
      {posts.map((post) => (
        <li key={post.id}>
          <SocialPostCard post={post} />
        </li>
      ))}
    </ul>
  );
}
