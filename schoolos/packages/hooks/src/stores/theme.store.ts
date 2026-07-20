import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';

  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function resolveTheme(theme: Theme): 'light' | 'dark' {
  if (theme === 'system') return getSystemTheme();
  return theme;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      resolvedTheme: 'light',

      setTheme: (theme) => {
        const resolvedTheme = resolveTheme(theme);
        set({ theme, resolvedTheme });
      },

      toggleTheme: () => {
        const { theme } = get();
        const newTheme =
          theme === 'light'
            ? 'dark'
            : theme === 'dark'
              ? 'system'
              : 'light';
        const resolvedTheme = resolveTheme(newTheme);
        set({ theme: newTheme, resolvedTheme });
      },
    }),
    {
      name: 'schoolos-theme',
      partialize: (state) => ({
        theme: state.theme,
      }),
    },
  ),
);
