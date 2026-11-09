import { afterEach, describe, expect, it } from 'vitest';
import { usePlayerStore } from './playerStore';

const HERO = 'hero';
const CARD = 'card';

function activeKey(): string | null {
  return usePlayerStore.getState().activeKey;
}

afterEach(() => {
  usePlayerStore.setState(usePlayerStore.getInitialState(), true);
});

describe('TC-WEB-033 player store', () => {
  it('GIVEN a fresh store WHEN it is read THEN no video plays', () => {
    expect(activeKey()).toBeNull();
  });

  it('GIVEN an idle store WHEN play(hero), play(card), stop(hero), stop(card) run in turn THEN the active key is hero, card, card, then null', () => {
    const { play, stop } = usePlayerStore.getState();
    const steps = [() => play(HERO), () => play(CARD), () => stop(HERO), () => stop(CARD)];

    const activeAfterEachStep = steps.map((step) => {
      step();
      return activeKey();
    });

    expect(activeAfterEachStep).toEqual([HERO, CARD, CARD, null]);
  });

  it('GIVEN a playing video WHEN stop() runs without a key THEN nothing plays', () => {
    usePlayerStore.getState().play(HERO);

    usePlayerStore.getState().stop();

    expect(activeKey()).toBeNull();
  });
});
