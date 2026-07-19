'use client';

import { create } from 'zustand';

interface ActivePathState {
  activePath: string;
  setActivePath: (path: string) => void;
}

export const useActivePathStore = create<ActivePathState>((set) => ({
  activePath: '/dashboard',
  setActivePath: (path) => set({ activePath: path }),
}));
