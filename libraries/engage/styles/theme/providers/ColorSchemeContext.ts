import { createContext } from 'react';
import { type ColorSchemeMode, type ColorSchemeName } from '../createTheme';

/**
 * A new mode, or an updater that receives the effective one. Null clears the visitor's pick.
 */
export type SetColorSchemeMode =
  | ColorSchemeMode
  | null
  | ((current: ColorSchemeMode) => ColorSchemeMode | null);

export interface ColorSchemeContextValue {
  /**
   * The mode in effect: the one the visitor picked, or the configured default while they picked
   * none.
   */
  mode: ColorSchemeMode;
  /**
   * The mode that applies while the visitor picked none, as configured within the app settings.
   */
  defaultMode: ColorSchemeMode;
  /**
   * The color scheme that is applied - the mode resolved against the operating system and the
   * configured default. Components style against this one.
   */
  activeColorScheme: ColorSchemeName | null;
  /**
   * Updates the color scheme. Setting null clears the visitor's pick, so the configured default
   * applies again.
   */
  setMode: (value: SetColorSchemeMode) => void;
  /**
   * Everything that can be set: the color schemes the active theme styles, plus 'system'. Passing
   * anything else to setMode has no effect.
   */
  modes: ColorSchemeMode[];
}

export const ColorSchemeContext = createContext<ColorSchemeContextValue>({
  mode: 'light',
  defaultMode: 'light',
  activeColorScheme: 'light',
  setMode: () => undefined,
  modes: ['light'],
});
