import { create } from 'zustand';
import type { PlayerStore } from './player.types';

/** The single inline-playback store; no persistence (LD-24). */
export const usePlayerStore = create<PlayerStore>()((set, get) => ({
  activeKey: null,
  play: (key) => {
    set({ activeKey: key });
  },
  stop: (key) => {
    if (key === undefined || get().activeKey === key) set({ activeKey: null });
  },
}));
