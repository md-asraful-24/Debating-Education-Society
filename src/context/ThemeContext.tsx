'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeName } from '@/lib/types';

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  applyTheme: (theme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>('emerald');

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings?.theme) {
          setThemeState(data.settings.theme);
          applyThemeClass(data.settings.theme);
        }
      })
      .catch((err) => console.error('Failed to fetch initial theme:', err));
  }, []);

  const applyThemeClass = (newTheme: ThemeName) => {
    const root = document.documentElement;
    root.setAttribute('data-theme', newTheme);
  };

  const setTheme = (newTheme: ThemeName) => {
    setThemeState(newTheme);
    applyThemeClass(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, applyTheme: applyThemeClass }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
