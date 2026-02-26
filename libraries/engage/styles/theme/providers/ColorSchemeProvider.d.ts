import * as React from 'react';
import { type DefaultColorScheme } from '../createTheme';

export interface ColorSchemeContextValue {
  /**
   * The current color scheme (e.g., 'light' or 'dark')
   */
  mode: DefaultColorScheme;
  /**
   * Function to update the color scheme
   */
  setMode: React.Dispatch<React.SetStateAction<DefaultColorScheme>>;
}

export const ColorSchemeContext: React.Context<ColorSchemeContextValue>;

export interface ColorSchemeProviderProps {
  /**
   * The initial color scheme (e.g., 'light' or 'dark')
   * @default 'light'
   */
  colorScheme: DefaultColorScheme;

  /**
   * The children to render within the provider
   */
  children: React.ReactNode;
}

/**
 * Provider component for the ColorSchemeContext.
 */
declare const ColorSchemeProvider: React.FC<ColorSchemeProviderProps>;

export default ColorSchemeProvider;
