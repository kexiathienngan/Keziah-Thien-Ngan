import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';

type Theme = 'warm' | 'cool';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const storedTheme = localStorage.getItem('bible-tutor-theme');
      return (storedTheme === 'warm' || storedTheme === 'cool') ? storedTheme : 'warm';
    } catch (error) {
      return 'warm';
    }
  });

  useEffect(() => {
    document.body.classList.remove('theme-warm', 'theme-cool');
    document.body.classList.add(`theme-${theme}`);
    try {
      localStorage.setItem('bible-tutor-theme', theme);
    } catch (error) {
      console.error("Failed to save theme to localStorage", error);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'warm' ? 'cool' : 'warm'));
  };

  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
