import styles from './ui.module.css';

const SEPARATOR = '—';
const COPIES = ['first', 'second'] as const;

/** Props of Ticker. */
export interface TickerProps {
  /** Words shown in a loop, such as IDENTITY, PURPOSE. */
  readonly words: readonly string[];
}

/**
 * Accent band with a scrolling word loop; screen readers get the words once and the animated
 * copies stay hidden. Reduced-motion users see it static (global.css).
 */
export function Ticker({ words }: TickerProps) {
  return (
    <div className={styles.ticker}>
      <p className={styles.visuallyHidden}>{words.join(', ')}</p>
      <div className={styles.tickerTrack} aria-hidden="true">
        {COPIES.map((copy) =>
          words.map((word) => (
            <span className={styles.tickerWord} key={`${copy}-${word}`}>
              {word} {SEPARATOR}
            </span>
          )),
        )}
      </div>
    </div>
  );
}
