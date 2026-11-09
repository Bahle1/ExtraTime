import type { Image, SocialPost } from '@extratime/shared';
import { Link } from 'react-router';
import ui from '../../../components/ui/ui.module.css';
import { ArtworkImage } from '../../../components/ui/ArtworkImage';
import { ExternalLink } from '../../../components/ui/ExternalLink';
import { formatDate } from '../../../lib/formatting/formatDate';
import { formatPlatform } from '../../../lib/formatting/formatPlatform';
import styles from './social.module.css';

/** Intrinsic size assumed when the platform omits media dimensions; the frame is 16:9 anyway. */
const UNKNOWN_MEDIA_SIZE = { width: 16, height: 9 } as const;
const METRIC_LABELS = [
  ['likes', 'like', 'likes'],
  ['comments', 'comment', 'comments'],
  ['shares', 'share', 'shares'],
  ['views', 'view', 'views'],
] as const;
const COUNT_FORMAT = new Intl.NumberFormat('en-GB');
const POSITION_DIGITS = 2;

/** Props of SocialPostCard. */
export interface SocialPostCardProps {
  readonly post: SocialPost;
  /** 1-based place in a carousel, shown as "01 / 06"; omitted in the feed grid. */
  readonly position?: { readonly index: number; readonly total: number };
}

function padded(value: number): string {
  return String(value).padStart(POSITION_DIGITS, '0');
}

function thumbnailOf(post: SocialPost): Image | null {
  const media = post.media[0];
  if (media === undefined) return null;
  const url = media.thumbnailUrl ?? (media.type === 'image' ? media.url : null);
  if (url === null) return null;
  const width = media.width ?? UNKNOWN_MEDIA_SIZE.width;
  return { url, width, height: media.height ?? UNKNOWN_MEDIA_SIZE.height, alt: '' };
}

function metricsText(metrics: SocialPost['metrics']): string | null {
  if (metrics === null) return null;
  const parts = METRIC_LABELS.flatMap(([key, one, many]) => {
    const count = metrics[key];
    return count === null ? [] : [`${COUNT_FORMAT.format(count)} ${count === 1 ? one : many}`];
  });
  return parts.length === 0 ? null : parts.join(' · ');
}

/** Feed card: thumbnail, platform, date, caption, counts and links to the original and its episode (LFR-19). */
export function SocialPostCard({ post, position }: SocialPostCardProps) {
  const thumbnail = thumbnailOf(post);
  const metrics = metricsText(post.metrics);
  const platform = formatPlatform(post.platform);
  return (
    <article className={styles.card}>
      {thumbnail !== null && (
        <div className={styles.cardMedia}>
          <ArtworkImage image={thumbnail} />
          <span className={styles.platformTag} aria-hidden="true">
            {platform}
          </span>
        </div>
      )}
      <div className={styles.cardBody}>
        <div className={styles.cardTop}>
          <h3 className={styles.cardHeading}>
            {platform} <span aria-hidden="true">·</span>{' '}
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          </h3>
          {position !== undefined && (
            <span className={styles.position} aria-hidden="true">
              {padded(position.index)} / {padded(position.total)}
            </span>
          )}
        </div>
        {post.caption !== null && <p className={styles.caption}>{post.caption}</p>}
        {metrics !== null && <p className={styles.metrics}>{metrics}</p>}
        <div className={styles.links}>
          <ExternalLink className={ui.textLink} href={post.permalink}>
            View on {platform}
          </ExternalLink>
          {post.relatedEpisodeSlug !== null && (
            <Link className={ui.textLink} to={`/episodes/${post.relatedEpisodeSlug}`}>
              Watch the episode
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
