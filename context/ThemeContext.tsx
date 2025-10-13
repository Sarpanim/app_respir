import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useAppContext } from './AppContext';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { generalSettings } = useAppContext();

  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const stored = localStorage.getItem('respir-theme') as Theme | null;
      if (stored) return stored;
      if (generalSettings?.defaultTheme) return generalSettings.defaultTheme;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return generalSettings?.defaultTheme || 'dark';
    }
  });

  useEffect(() => {
    const stored = localStorage.getItem('respir-theme') as Theme | null;
    if (!stored && generalSettings?.defaultTheme && theme !== generalSettings.defaultTheme) {
      setTheme(generalSettings.defaultTheme);
    }
  }, [generalSettings?.defaultTheme]);

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('respir-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
