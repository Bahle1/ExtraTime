import { fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { EpisodeBuilder } from '@extratime/shared/testing';
import { usePlayerStore } from '../store/playerStore';
import { InlineVideo } from './InlineVideo';

const episode = new EpisodeBuilder().buildSummary();
const other = new EpisodeBuilder()
  .with({ id: 'ep_s03e13', slug: 's03e13-cup-run', title: 'Cup Run' })
  .buildSummary();
const EMBED_SRC =
  'https://www.youtube-nocookie.com/embed/Xk3pQ9vL2mA?autoplay=1&playsinline=1&rel=0';

function renderPair() {
  return render(
    <>
      <section aria-label="first">
        <InlineVideo playerKey="first" episode={episode} />
      </section>
      <section aria-label="second">
        <InlineVideo playerKey="second" episode={other} />
      </section>
    </>,
  );
}

function region(name: string) {
  return within(screen.getByRole('region', { name }));
}

afterEach(() => {
  usePlayerStore.setState(usePlayerStore.getInitialState(), true);
});

describe('TC-WEB-051 InlineVideo', () => {
  it('GIVEN artwork WHEN its play button is clicked THEN the nocookie embed replaces it in the same widget', () => {
    renderPair();

    fireEvent.click(region('first').getByRole('button', { name: 'Play Derby Day Fallout' }));

    const frame = region('first').getByTitle('YouTube video: Derby Day Fallout');
    expect(frame.getAttribute('src')).toBe(EMBED_SRC);
    expect(region('first').queryByRole('img', { name: episode.artwork.alt })).toBeNull();
    expect(region('first').queryByRole('button', { name: 'Close video' })).not.toBeNull();
  });

  it('GIVEN one video plays WHEN another widget is played THEN only the second embed remains', () => {
    renderPair();

    fireEvent.click(region('first').getByRole('button', { name: 'Play Derby Day Fallout' }));
    fireEvent.click(region('second').getByRole('button', { name: 'Play Cup Run' }));

    expect(document.querySelectorAll('iframe')).toHaveLength(1);
    expect(region('second').queryByTitle('YouTube video: Cup Run')).not.toBeNull();
    expect(region('first').queryByRole('img', { name: episode.artwork.alt })).not.toBeNull();
  });

  it('GIVEN a playing video WHEN Close video is clicked THEN the artwork and play button return', () => {
    renderPair();
    fireEvent.click(region('first').getByRole('button', { name: 'Play Derby Day Fallout' }));

    fireEvent.click(region('first').getByRole('button', { name: 'Close video' }));

    expect(document.querySelector('iframe')).toBeNull();
    expect(
      region('first').queryByRole('button', { name: 'Play Derby Day Fallout' }),
    ).not.toBeNull();
  });

  it('GIVEN a playing video WHEN its widget unmounts THEN playback stops', () => {
    const { unmount } = renderPair();
    fireEvent.click(region('first').getByRole('button', { name: 'Play Derby Day Fallout' }));

    unmount();

    expect(usePlayerStore.getState().activeKey).toBeNull();
  });

  it('GIVEN an episode without a video WHEN InlineVideo renders THEN only the artwork shows', () => {
    const withoutVideo = { ...episode, media: { ...episode.media, video: null } };

    render(<InlineVideo playerKey="solo" episode={withoutVideo} />);

    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.queryByRole('img', { name: episode.artwork.alt })).not.toBeNull();
  });
});
