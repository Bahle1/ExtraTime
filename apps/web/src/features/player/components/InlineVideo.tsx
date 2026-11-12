import { useEffect, useRef } from 'react';
import { ArtworkImage } from '../../../components/ui/ArtworkImage';
import {
  YOUTUBE_EMBED_BASE_URL,
  YOUTUBE_EMBED_PARAMS,
  YOUTUBE_IFRAME_ALLOW,
} from '../store/player.constants';
import { usePlayerStore } from '../store/playerStore';
import type { PlayableEpisode } from '../store/player.types';
import styles from './InlineVideo.module.css';

/** Props of InlineVideo. */
export interface InlineVideoProps {
  /** Unique per widget on the page (useId), so the same episode can sit in two widgets. */
  readonly playerKey: string;
  readonly episode: PlayableEpisode;
  /** Marks the LCP artwork (hero, episode page). */
  readonly priority?: boolean;
  /** Black-and-white artwork until it plays (hero and feature panels). */
  readonly mono?: boolean;
}

function useStopOnUnmount(playerKey: string): void {
  const stop = usePlayerStore((state) => state.stop);
  useEffect(() => () => stop(playerKey), [playerKey, stop]);
}

function useFocusWhenStarted(isActive: boolean) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const focusIsLost = document.activeElement === null || document.activeElement === document.body;
    if (isActive && focusIsLost) closeRef.current?.focus();
  }, [isActive]);
  return closeRef;
}

/**
 * Artwork with a play button that swaps in the YouTube embed in the same place (no floating
 * player). The embed is youtube-nocookie, created only after a tap, never smaller than 200x200 px
 * (LFR-24); one plays at a time and leaving the page stops it.
 */
export function InlineVideo({
  playerKey,
  episode,
  priority = false,
  mono = false,
}: InlineVideoProps) {
  const isActive = usePlayerStore((state) => state.activeKey === playerKey);
  const { play, stop } = usePlayerStore.getState();
  const closeRef = useFocusWhenStarted(isActive);
  useStopOnUnmount(playerKey);
  const video = episode.media.video;
  if (video === null) return <ArtworkImage image={episode.artwork} priority={priority} />;
  return (
    <div className={styles.player} data-playing={isActive ? '' : undefined}>
      <div className={styles.media} data-mono={mono && !isActive ? '' : undefined}>
        {isActive ? (
          <iframe
            className={styles.frame}
            src={`${YOUTUBE_EMBED_BASE_URL}/${video.videoId}?${YOUTUBE_EMBED_PARAMS}`}
            title={`YouTube video: ${episode.title}`}
            allow={YOUTUBE_IFRAME_ALLOW}
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <>
            <ArtworkImage image={episode.artwork} priority={priority} fill />
            <button
              className={styles.playOverlay}
              type="button"
              aria-label={`Play ${episode.title}`}
              aria-pressed={false}
              onClick={() => play(playerKey)}
            >
              <span className={styles.playIcon} aria-hidden="true">
                ▶
              </span>
            </button>
          </>
        )}
      </div>
      {isActive && (
        <div className={styles.nowPlaying}>
          <span className={styles.nowPlayingLabel} role="status">
            Now playing
          </span>
          <button
            className={styles.closeButton}
            type="button"
            ref={closeRef}
            onClick={() => stop(playerKey)}
          >
            Close video
          </button>
        </div>
      )}
    </div>
  );
}
