'use client';

import { create } from 'zustand';

interface DashboardModuleState {
  /** Per-module persisted UI state (search text, filters, pagination, etc.) */
  moduleStates: Record<string, Record<string, unknown>>;
  /** Save UI state for a specific module path */
  setModuleState: (path: string, state: Record<string, unknown>) => void;
  /** Get UI state for a specific module path */
  getModuleState: (path: string) => Record<string, unknown>;
  /** Clear state for a specific module */
  clearModuleState: (path: string) => void;
  /** Clear all module state */
  clearAllModuleStates: () => void;
}

/**
 * Store for persisting per-module UI state (search text, filters, pagination, etc.)
 * across navigations. When a user leaves a tab and returns, their previous state
 * (including search input, selected filters, current page) is restored.
 */
export const useDashboardModuleStore = create<DashboardModuleState>((set, get) => ({
  moduleStates: {},

  setModuleState: (path: string, state: Record<string, unknown>) => {
    set({
      moduleStates: {
        ...get().moduleStates,
        [path]: { ...(get().moduleStates[path] || {}), ...state },
      },
    });
  },

  getModuleState: (path: string) => {
    return get().moduleStates[path] || {};
  },

  clearModuleState: (path: string) => {
    const newStates = { ...get().moduleStates };
    delete newStates[path];
    set({ moduleStates: newStates });
  },

  clearAllModuleStates: () => {
    set({ moduleStates: {} });
  },
}));
