import { type Palette } from './createPalette'
import { type Typography, type TypographyOptions } from './createTypography';
import { type Breakpoints } from './createBreakpoints';
import { type Spacing } from './createSpacing';
import { type Transitions } from './transitions';
import { type ZIndex } from './zIndex';
import { type GetColorSchemeSelector, type ActiveColorSchemeSwitcher } from './helpers';


export { type Breakpoint } from './createBreakpoints'

export type DefaultColorScheme = 'light' | 'dark';

export interface ColorSchemeOptions {
  palette?: Palette;
  typography?: TypographyOptions | ((palette: Palette) => TypographyOptions);
}

export interface ThemeOptions {
  defaultColorScheme?: 'light' | 'dark';
  colorSchemeSelector?: 'data' | 'class';
  palette?: Palette;
  typography?: TypographyOptions | ((palette: Palette) => TypographyOptions);
  colorSchemes?: Record<DefaultColorScheme, ColorSchemeOptions>;
}

export interface BaseTheme {
  /**
   * The palette defines the theme colors.
   */
  palette: Palette;
  /**
   * Font styles for multiple typography variants.
   */
  typography: Typography;
}

export interface Theme extends BaseTheme {
  /**
   * The default color scheme to use when the user has not specified a preference.
   */
  defaultColorScheme?: 'light' | 'dark';
  /**
   * API to simplify the use of media queries.
   */
  breakpoints: Breakpoints;
  /**
   * Use the spacing function to create consistent spacing.
   */
  spacing: Spacing;
  /**
   * API to simplify the creation of transitions
   */
  transitions: Transitions;
  /**
   * Reference to z-index values for multiple components.
   */
  zIndex: ZIndex;
}

export type ColorSchemeThemes = Record<DefaultColorScheme, BaseTheme>

export type ThemeInternal = Theme & {
  /**
   * Function that generates a CSS selector string for a given color scheme.
   */
  getColorSchemeSelector?: GetColorSchemeSelector;
  /**
   * Function that switches the color scheme by the corresponding selector type.
   */
  setActiveColorScheme?: ActiveColorSchemeSwitcher;
};

export function createTheme(options?: ThemeOptions): Theme;
