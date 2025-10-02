// context/ThemeContext.tsx
import React, { createContext, useContext, useMemo } from 'react';
import { generateTheme, destinationThemes, Theme } from '../constants/teamColors';

const defaultTheme = generateTheme('teal');

const ThemeContext = createContext<Theme>(defaultTheme);

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: React.ReactNode;
  destination: string;
  primaryColor?: string | null;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, destination, primaryColor }) => {
  const theme = useMemo(() => {
    // User's custom color from settings has top priority.
    // If not set, use the destination's specific color.
    // If that's not set, use the hardcoded destination theme as a fallback.
    // Finally, use the default theme.
    const colorName = primaryColor || (destinationThemes[destination] || destinationThemes['default']).name;
    return generateTheme(colorName);
  }, [destination, primaryColor]);

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};