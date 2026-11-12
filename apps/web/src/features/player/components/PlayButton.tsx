import buttons from '../../../components/ui/ui.module.css';
import { usePlayerStore } from '../store/playerStore';
import type { PlayableEpisode } from '../store/player.types';

/** Props of PlayButton. */
export interface PlayButtonProps {
  /** Key of the InlineVideo this button controls (the hero or episode-page video panel). */
  readonly playerKey: string;
  readonly episode: PlayableEpisode;
  /** Visible text while stopped; defaults to "Play". */
  readonly text?: string;
}

/**
 * Text toggle button for a nearby InlineVideo: its accessible name stays "Play {title}" and
 * aria-pressed shows whether that video plays; pressing it again stops it. Renders nothing without a video.
 */
export function PlayButton({ playerKey, episode, text = 'Play' }: PlayButtonProps) {
  const isActive = usePlayerStore((state) => state.activeKey === playerKey);
  const { play, stop } = usePlayerStore.getState();
  if (episode.media.video === null) return null;
  return (
    <button
      className={buttons.buttonPrimary}
      type="button"
      aria-label={`Play ${episode.title}`}
      aria-pressed={isActive}
      onClick={() => (isActive ? stop(playerKey) : play(playerKey))}
    >
      <span aria-hidden="true">{isActive ? '■' : '▶'}</span>
      {isActive ? 'Now playing' : text}
    </button>
  );
}
