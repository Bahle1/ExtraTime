import { useRef, type ReactNode } from 'react';
import styles from './ui.module.css';

/** Share of the visible track width one arrow press scrolls. */
const SCROLL_STEP_RATIO = 0.9;
const DEFAULT_HINT = 'Swipe or scroll for more';

/** Props of Carousel. */
export interface CarouselProps {
  /** Names the list and its arrow buttons, such as "Latest conversations". */
  readonly label: string;
  /** List items (li elements); each is one snap point. */
  readonly children: ReactNode;
  readonly hint?: string;
}

/** Horizontal scroll-snap list with previous/next buttons; swipe, trackpad and keyboard scrolling all work. */
export function Carousel({ label, children, hint = DEFAULT_HINT }: CarouselProps) {
  const trackRef = useRef<HTMLUListElement>(null);
  const scrollByStep = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (track === null || typeof track.scrollBy !== 'function') return;
    track.scrollBy({ left: direction * track.clientWidth * SCROLL_STEP_RATIO, behavior: 'smooth' });
  };
  return (
    <div className={styles.carousel}>
      <ul className={styles.carouselTrack} ref={trackRef} aria-label={label}>
        {children}
      </ul>
      <div className={styles.carouselFooter}>
        <p className={styles.carouselHint}>{hint}</p>
        <div className={styles.carouselControls}>
          <button
            className={styles.carouselButton}
            type="button"
            aria-label={`Previous ${label}`}
            onClick={() => scrollByStep(-1)}
          >
            <span aria-hidden="true">←</span>
          </button>
          <button
            className={styles.carouselButton}
            type="button"
            aria-label={`Next ${label}`}
            onClick={() => scrollByStep(1)}
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
