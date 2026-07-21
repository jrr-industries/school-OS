import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserPreference {
  sidebarCollapsed: boolean;
  language: string;
  timezone: string;
}

interface UserState {
  preferences: UserPreference;

  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  setLanguage: (language: string) => void;
  setTimezone: (timezone: string) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, _get) => ({
      preferences: {
        sidebarCollapsed: false,
        language: 'en',
        timezone: 'UTC',
      },

      setSidebarCollapsed: (collapsed) =>
        set((state) => ({
          preferences: { ...state.preferences, sidebarCollapsed: collapsed },
        })),

      toggleSidebar: () =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            sidebarCollapsed: !state.preferences.sidebarCollapsed,
          },
        })),

      setLanguage: (language) =>
        set((state) => ({
          preferences: { ...state.preferences, language },
        })),

      setTimezone: (timezone) =>
        set((state) => ({
          preferences: { ...state.preferences, timezone },
        })),
    }),
    {
      name: 'schoolos-user',
      partialize: (state) => ({
        preferences: state.preferences,
      }),
    },
  ),
);
