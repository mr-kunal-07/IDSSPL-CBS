"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { DEFAULT_PRIMARY_COLOR, THEME_STORAGE_KEY } from "./theme-constants";

export { THEME_STORAGE_KEY, DEFAULT_PRIMARY_COLOR };

type ThemeContextValue = {
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  resetPrimaryColor: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const applyPrimaryColor = (color: string) => {
  document.documentElement.style.setProperty("--primary", color);
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [primaryColor, setPrimaryColorState] = useState(DEFAULT_PRIMARY_COLOR);

  // Sync with whatever the no-FOUC inline script (see layout.tsx) already
  // applied from localStorage before React hydrated.
  useEffect(() => {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored) setPrimaryColorState(stored);
  }, []);

  const setPrimaryColor = useCallback((color: string) => {
    setPrimaryColorState(color);
    applyPrimaryColor(color);
    window.localStorage.setItem(THEME_STORAGE_KEY, color);
  }, []);

  const resetPrimaryColor = useCallback(() => {
    setPrimaryColor(DEFAULT_PRIMARY_COLOR);
  }, [setPrimaryColor]);

  return (
    <ThemeContext.Provider value={{ primaryColor, setPrimaryColor, resetPrimaryColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
