import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useAppContext } from './AppContext';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { generalSettings } = useAppContext();

  // Initialize theme with correct priority to avoid flickering:
  // 1. User's choice from localStorage
  // 2. Admin's default setting
  // 3. System preference (as a final fallback)
  const [theme, setTheme] = useState<Theme>(() => {
    try {
        const storedTheme = localStorage.getItem('respir-theme') as Theme;
        if (storedTheme) {
            return storedTheme;
        }
        if (generalSettings && generalSettings.defaultTheme) {
            return generalSettings.defaultTheme;
        }
        const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        return preferredTheme;
    } catch (error) {
        // Fallback for SSR or environments where window is not defined.
        // The default settings specify 'dark', so we can safely use it.
        return generalSettings?.defaultTheme || 'dark';
    }
  });
  
  // This effect ensures that if the admin changes the default theme,
  // the app reflects this change for users who haven't set their own preference.
  useEffect(() => {
    const storedTheme = localStorage.getItem('respir-theme') as Theme;
    if (!storedTheme && generalSettings.defaultTheme && theme !== generalSettings.defaultTheme) {
        setTheme(generalSettings.defaultTheme);
    }
  }, [generalSettings.defaultTheme, theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('respir-theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};