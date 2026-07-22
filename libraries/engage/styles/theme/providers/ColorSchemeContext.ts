import { createContext, type Dispatch, type SetStateAction } from 'react';
import { type ColorSchemeName } from '../createTheme';

export interface ColorSchemeContextValue {
  /**
   * The current color scheme (e.g., 'light' or 'dark')
   */
  mode: ColorSchemeName | null;
  /**
   * Function to update the color scheme
   */
  setMode: Dispatch<SetStateAction<ColorSchemeName | null>>;
  /**
   * The modes the active theme actually provides. Only these can be set - passing anything else
   * to setMode has no effect.
   */
  modes: ColorSchemeName[];
}

export const ColorSchemeContext = createContext<ColorSchemeContextValue>({
  mode: 'light',
  setMode: () => undefined,
  modes: ['light'],
});
