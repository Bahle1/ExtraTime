import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { EpisodeBuilder } from '@extratime/shared/testing';
import { usePlayerStore } from '../store/playerStore';
import { PlayButton } from './PlayButton';

const KEY = 'episode-video';
const episode = new EpisodeBuilder().buildSummary();
const PLAY_NAME = 'Play Derby Day Fallout';

afterEach(() => {
  usePlayerStore.setState(usePlayerStore.getInitialState(), true);
});

describe('TC-WEB-052 PlayButton', () => {
  it('GIVEN its video is stopped WHEN the button is clicked THEN that video plays and the button is pressed', () => {
    render(<PlayButton playerKey={KEY} episode={episode} text="Play latest" />);

    fireEvent.click(screen.getByRole('button', { name: PLAY_NAME, pressed: false }));

    expect(usePlayerStore.getState().activeKey).toBe(KEY);
    const button = screen.getByRole('button', { name: PLAY_NAME, pressed: true });
    expect(button.textContent).toContain('Now playing');
  });

  it('GIVEN its video plays WHEN the button is clicked again THEN the video stops', () => {
    usePlayerStore.getState().play(KEY);
    render(<PlayButton playerKey={KEY} episode={episode} />);

    fireEvent.click(screen.getByRole('button', { name: PLAY_NAME, pressed: true }));

    expect(usePlayerStore.getState().activeKey).toBeNull();
  });

  it('GIVEN an episode without a video WHEN PlayButton renders THEN no button is shown', () => {
    const withoutVideo = { ...episode, media: { ...episode.media, video: null } };

    render(<PlayButton playerKey={KEY} episode={withoutVideo} />);

    expect(screen.queryByRole('button')).toBeNull();
  });
});
