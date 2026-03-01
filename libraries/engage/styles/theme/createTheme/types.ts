import { type Palette } from './createPalette';
import { type Typography, type TypographyOptions } from './createTypography';
import { type Breakpoints } from './createBreakpoints';
import { type Spacing } from './createSpacing';
import { type Transitions } from './transitions';
import { type ZIndex } from './zIndex';
import { type GetColorSchemeSelector, type ActiveColorSchemeSwitcher } from './helpers';
import { type CreateCssVarsForColorSchemeThemesReturnValue } from './createCssVarsForColorSchemeThemes';

export type { Breakpoint } from './createBreakpoints';

const colorSchemes = ['light', 'dark'] as const;

export type ColorSchemeName = (typeof colorSchemes)[number];

const selectorTypes = ['data', 'class'] as const;

export type ColorSchemeSelectorType = (typeof selectorTypes)[number];

export interface ColorSchemeOptions {
  palette?: Palette;
  typography?: TypographyOptions | ((palette: Palette) => TypographyOptions);
}

export interface ThemeOptions {
  defaultColorScheme?: ColorSchemeName;
  colorSchemeSelector?: ColorSchemeSelectorType;
  palette?: Palette;
  typography?: TypographyOptions | ((palette: Palette) => TypographyOptions);
  colorSchemes?: Record<ColorSchemeName, ColorSchemeOptions>;
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
  defaultColorScheme?: ColorSchemeName;
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

export type ColorSchemeThemes = Record<ColorSchemeName, BaseTheme>

export type ThemeInternal = Theme & Pick<CreateCssVarsForColorSchemeThemesReturnValue, 'generateStyleSheets'> & {
  /**
   * Function that generates a CSS selector string for a given color scheme.
   */
  getColorSchemeSelector: GetColorSchemeSelector;
  /**
   * Function that switches the color scheme by the corresponding selector type.
   */
  setActiveColorScheme: ActiveColorSchemeSwitcher;
};
