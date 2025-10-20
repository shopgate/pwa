import { type Palette } from './createPalette'
import { type Typography, type TypographyOptions } from './createTypography';
import { type Breakpoints } from './createBreakpoints';
import { type Spacing } from './createSpacing';
import { type Transitions } from './transitions';
import { type ZIndex } from './zIndex';

export { type Breakpoint } from './createBreakpoints'

export interface ThemeOptions {
  typography?: TypographyOptions | ((palette: Palette) => TypographyOptions);
}

export interface Theme {
  /**
   * The palette defines the theme colors.
   */
  palette: Palette;
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
   * Font styles for multiple typography variants.
   */
  typography: Typography;
  /**
   * Reference to z-index values for multiple components.
   */
  zIndex: ZIndex;
}

export function createTheme(options?: ThemeOptions): Theme;
