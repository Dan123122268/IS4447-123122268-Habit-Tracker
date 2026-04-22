import { Colors } from '@/constants/theme';
import { createContext, ReactNode, useContext } from 'react';

type ThemeColors = typeof Colors.light;

const ThemeColorsContext = createContext<ThemeColors>(Colors.light);

type Props = {
  children: ReactNode;
  colors: ThemeColors;
};

export function ThemeColorsProvider({ children, colors }: Props) {
  return (
    <ThemeColorsContext.Provider value={colors}>
      {children}
    </ThemeColorsContext.Provider>
  );
}

export function useThemeColors() {
  return useContext(ThemeColorsContext);
}
