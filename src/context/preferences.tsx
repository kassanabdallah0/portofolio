import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { readPreference, savePreference } from '@/lib/preferences';

export type Language = 'fr' | 'en';
type Theme = 'light' | 'dark';
type Preferences = {
  language: Language;
  theme: Theme;
  toggleLanguage: () => void;
  toggleTheme: () => void;
};
const Context = createContext<Preferences | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() =>
    readPreference('language') === 'en' ? 'en' : 'fr',
  );
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = readPreference('theme');
    return saved === 'dark' || saved === 'light'
      ? saved
      : window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
  });
  useEffect(() => {
    document.documentElement.lang = language;
    savePreference('language', language);
  }, [language]);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    savePreference('theme', theme);
  }, [theme]);
  return (
    <Context.Provider
      value={{
        language,
        theme,
        toggleLanguage: () => setLanguage((v) => (v === 'fr' ? 'en' : 'fr')),
        toggleTheme: () => setTheme((v) => (v === 'light' ? 'dark' : 'light')),
      }}
    >
      {children}
    </Context.Provider>
  );
}

// Context and hook share this small module deliberately.
// eslint-disable-next-line react-refresh/only-export-components
export function usePreferences() {
  const context = useContext(Context);
  if (!context) throw new Error('PreferencesProvider is required');
  return context;
}
