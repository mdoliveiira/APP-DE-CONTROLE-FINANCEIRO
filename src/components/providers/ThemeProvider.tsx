'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { type Theme, getInitialTheme, applyTheme } from '@/lib/theme';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const initialTheme = getInitialTheme();
    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      if (!prev) return 'dark';
      const newTheme = prev === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      return newTheme;
    });
  };

  // Renderizar children mesmo antes do tema estar carregado (dark por padrão via CSS)
  return (
    <ThemeContext.Provider value={{ theme: theme || 'dark', toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
