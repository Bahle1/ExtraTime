/** Source of the current time, injected so tests run on a fixed instant (LD-14). */
export interface Clock {
  /** The current instant. */
  now(): Date;
}

/** Wall clock: the only argument-less new Date() in the API (LD-14). */
export const systemClock: Clock = { now: () => new Date() };
