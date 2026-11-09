import { EpisodeBuilder } from '@extratime/shared/testing';
import { fireEvent, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '../../../test/renderWithProviders';
import { EpisodeCard } from './EpisodeCard';

const summary = new EpisodeBuilder().buildSummary();

function shownBadges(): (string | null)[] {
  const list = screen.queryByRole('list', { name: 'Episode labels' });
  const items = list === null ? [] : within(list).getAllByRole('listitem');
  return items.map((item) => item.textContent);
}

describe('TC-WEB-015 EpisodeCard', () => {
  it.each([
    {
      variant: 'a coded full episode',
      fields: { season: 3, episodeNumber: 14, episodeType: 'full' },
      badges: ['S03E14'],
    },
    {
      variant: 'an uncoded trailer',
      fields: { season: null, episodeNumber: null, episodeType: 'trailer' },
      badges: ['Trailer'],
    },
    {
      variant: 'null codes and an unknown type',
      fields: { season: null, episodeNumber: null, episodeType: 'livestream' },
      badges: [],
    },
  ] as const)(
    'GIVEN $variant WHEN EpisodeCard renders THEN it shows the badges $badges and every core field',
    ({ fields, badges }) => {
      renderWithProviders(<EpisodeCard episode={{ ...summary, ...fields }} />);

      expect(shownBadges()).toEqual(badges);
      const title = screen.getByRole('link', { name: 'Derby Day Fallout' });
      expect(title.getAttribute('href')).toBe('/episodes/s03e14-derby-day-fallout');
      expect(screen.queryByText('2 November 2026')).not.toBeNull();
      expect(screen.queryByText('1:02:05')).not.toBeNull();
      expect(screen.queryByText(summary.summary)).not.toBeNull();
      const playName = 'Play Derby Day Fallout';
      expect(screen.queryByRole('button', { name: playName, pressed: false })).not.toBeNull();
      const watch = screen.getByRole('link', { name: /^Watch on YouTube/ });
      expect(watch.getAttribute('href')).toBe('https://www.youtube.com/watch?v=Xk3pQ9vL2mA');
      expect(watch.getAttribute('rel')).toBe('noopener noreferrer');
    },
  );

  it('GIVEN artwork that fails to load WHEN the error fires THEN a placeholder of the reserved size replaces it', () => {
    renderWithProviders(<EpisodeCard episode={summary} />);
    const { alt, width, height } = summary.artwork;
    const artwork = screen.getByRole('img', { name: alt });

    fireEvent.error(artwork);

    const placeholder = screen.getByRole('img', { name: alt });
    expect(placeholder).not.toBe(artwork);
    expect(placeholder.getAttribute('src')).toBeNull();
    expect(placeholder.getAttribute('width')).toBe(String(width));
    expect(placeholder.getAttribute('height')).toBe(String(height));
  });
});
