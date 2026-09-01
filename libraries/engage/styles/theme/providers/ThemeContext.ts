import { createContext } from 'react';
import { type Theme } from '../createTheme';

export const ThemeContext = createContext<Theme>({ } as Theme);
