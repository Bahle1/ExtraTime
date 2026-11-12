import { describe, expect, it } from 'vitest';
import { formatDuration } from './formatDuration';

describe('TC-WEB-019 formatDuration', () => {
  it.each([
    { seconds: 0, expected: '0:00' },
    { seconds: 59, expected: '0:59' },
    { seconds: 61, expected: '1:01' },
    { seconds: 3725, expected: '1:02:05' },
    { seconds: 7200, expected: '2:00:00' },
  ] as const)(
    'GIVEN $seconds seconds WHEN formatted THEN it reads $expected',
    ({ seconds, expected }) => {
      expect(formatDuration(seconds)).toBe(expected);
    },
  );
});
