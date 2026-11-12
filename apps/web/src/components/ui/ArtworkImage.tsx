import type { Image } from '@extratime/shared';
import { useState } from 'react';
import styles from './ui.module.css';

/** Props of ArtworkImage. */
export interface ArtworkImageProps {
  readonly image: Image;
  /** Marks the LCP image: eager loading with fetchpriority="high" (§3.6.8). */
  readonly priority?: boolean;
  /** Fills a positioned parent (such as InlineVideo) instead of reserving its own 16:9 box. */
  readonly fill?: boolean;
}

function ArtworkPlaceholder({ image }: ArtworkImageProps) {
  const naming =
    image.alt === '' ? { 'aria-hidden': true } : { role: 'img', 'aria-label': image.alt };
  return (
    <svg
      className={styles.placeholder}
      width={image.width}
      height={image.height}
      viewBox={`0 0 ${image.width} ${image.height}`}
      preserveAspectRatio="none"
      {...naming}
    >
      <rect width={image.width} height={image.height} />
    </svg>
  );
}

/** 16:9 artwork frame at its reserved size; a placeholder replaces images that fail or are offline (LFR-14). */
export function ArtworkImage({ image, priority = false, fill = false }: ArtworkImageProps) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  return (
    <div className={styles.artworkFrame} data-fill={fill ? '' : undefined}>
      {failedUrl === image.url ? (
        <ArtworkPlaceholder image={image} />
      ) : (
        <img
          className={styles.artwork}
          src={image.url}
          alt={image.alt}
          width={image.width}
          height={image.height}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          onError={() => setFailedUrl(image.url)}
        />
      )}
    </div>
  );
}
