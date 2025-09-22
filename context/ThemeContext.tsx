// context/ThemeContext.tsx
import React, { createContext, useContext, useMemo } from 'react';
import { generateTheme, destinationThemes, Theme } from '../constants/teamColors';

const defaultTheme = generateTheme('teal');

const ThemeContext = createContext<Theme>(defaultTheme);

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: React.ReactNode;
  destination: string;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, destination }) => {
  const theme = useMemo(() => {
    const colorName = (destinationThemes[destination] || destinationThemes['default']).name;
    return generateTheme(colorName);
  }, [destination]);

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};