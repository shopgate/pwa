import type { PaletteOptions, Palette } from './createPalette';
import type { Typography, TypographyOptions } from './createTypography';
import type { ComponentsOptions, ComponentVars, Components } from './createComponents';
import type { Breakpoints } from './createBreakpoints';
import type { Spacing } from './createSpacing';
import type { Transitions } from './transitions';
import type { ZIndex } from './zIndex';
import type { Layout } from './layout';
import type { ApplyStyles } from './applyStyles';
import type { GetColorSchemeSelector, ActiveColorSchemeSwitcher } from './helpers';
import type { CreateCssVarsForColorSchemeThemesReturnValue } from './createCssVarsForColorSchemeThemes';
import type { Shape, ShapeOptions } from './createShape';
import type { Shadows, ShadowSize } from './shadows';

export type { Breakpoint } from './createBreakpoints';
export type { PaletteColorsWithMain } from './createPalette';

export const COLOR_SCHEME_NAMES = ['light', 'dark'] as const;

export type ColorSchemeName = (typeof COLOR_SCHEME_NAMES)[number];

export const COLOR_SCHEME_SYSTEM = 'system';

/**
 * A selectable color scheme: one the theme provides, or `system` to follow the operating system.
 */
export type ColorSchemeMode = ColorSchemeName | typeof COLOR_SCHEME_SYSTEM;

const selectorTypes = ['data', 'class'] as const;

export type ColorSchemeSelectorType = (typeof selectorTypes)[number];

type DeepPartial<T> =
  T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T;

/**
 * Available options for creating a color scheme object. Color schemes can be used to generate
 * multiple themes with different color palettes and typography, which can be switched
 * dynamically based on user preference or system settings.
 */
export type ColorSchemeOptions = Pick<ThemeOptions, 'palette' | 'typography' | 'components' | 'shape'>;

export interface ThemeOptions {
  /**
   * The default color scheme to use when the user has not specified a preference.
   * @default 'light'
   */
  defaultColorScheme?: ColorSchemeName;
  /**
   * The type of selector to use for applying color schemes. Possible values are 'data' for
   * data attributes (e.g., `data-color-scheme="dark"`) and 'class' for CSS classes
   * (e.g., `class="dark"`).
   * @default 'data'
   */
  colorSchemeSelector?: ColorSchemeSelectorType;
  /**
   * Prefix for the generated CSS variables. For example, if the prefix is 'sg', a theme property
   * like `palette.primary.main` will generate a CSS variable `--sg-palette-primary-main`.
   * @default 'sg'
   */
  cssVarPrefix?: string;
  /**
   * The palette defines the theme colors.
   */
  palette?: DeepPartial<PaletteOptions>;
  /**
   * Font styles for multiple typography variants.
   */
  typography?: TypographyOptions | ((palette: Palette) => TypographyOptions);
  shape?: ShapeOptions;
  /**
   * The color schemes to generate themes for. Each key is a color scheme name (e.g., 'light', 'dark'),
   * and the value is an object that can contain palette and typography options specific to that color scheme.
   * If a color scheme is not provided, it will inherit from the default scheme.
   * @example
   * colorSchemes: {
   *   light: {
   *     palette: { mode: 'light', primary: { main: '#000000' } },
   *     typography: { fontSize: 14 }
   *   },
   *   dark: {
   *     palette: { mode: 'dark', primary: { main: '#ffffff' } },
   *     typography: { fontSize: 14 }
   *   }
   * }
   */
  colorSchemes?: Record<ColorSchemeName, DeepPartial<ColorSchemeOptions>>;
  /**
   *  Component specific styling tokes.
   */
  components?: ComponentsOptions;
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
  /**
   * Component specific styling tokes.
   */
  components: ComponentVars;
  shape: Shape;
  /**
   * Pre-defined shadow styles for different elevation levels, following Material Design guidelines.
   */
  shadows: Shadows;
  /**
   * The finished box-shadow size (`none` | `low` | `medium` | `strong`)
   */
  shadowSizes: Record<ShadowSize, string>;
  /**
   * Adds an alpha value to a color, returning a new color string with the applied alpha.
   * @param color The color to modify.
   * @param coefficient The alpha coefficient to apply, either a number or a string representing a CSS calculation.
   * @returns A string representing the color with the applied alpha value.
   */
  alpha(color: string, coefficient: number | string): string;
  /**
   * Lightens a color by a given coefficient, returning a new color string with the applied lightening.
   * @param color The color to modify.
   * @param coefficient The coefficient to apply, either a number or a string representing a CSS calculation.
   * @returns A string representing the lightened color.
   */
  lighten(color: string, coefficient?: number | string): string;
  /**
   * Darkens a color by a given coefficient, returning a new color string with the applied darkening.
   * @param color The color to modify.
   * @param coefficient The coefficient to apply, either a number or a string representing a CSS calculation.
   * Defaults to `0.2` if not provided.
   * @returns A string representing the darkened color.
   */
  darken(color: string, coefficient?: number | string): string;
  /**
   * Calculates a contrast color (either black or white) based on the lightness of the input color.
   * @param color The color to evaluate.
   * @returns A string representing the contrast color (either black or white) for the input color.
   */
  contrastColor(color: string): string;
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
  /**
   * Mappings to runtime layout CSS variables (safe-area insets).
   * The values are `var(--...)` references to variables updated at runtime elsewhere in the app;
   * this node does not generate any new CSS variables.
   */
  layout: Layout;
  /**
   * An object that contains the CSS variable references for the theme properties.
   * It has the same structure as the theme, but the values are CSS variable references
   * (e.g., `var(--sg-palette-primary-main)`) instead of actual color values.
   */
  vars: Omit<BaseTheme, 'components'> & { components: ComponentVars};
  /**
   * A record of themes for each color scheme. Each key is a color scheme name (e.g., 'light', 'dark'),
   * and the value is a theme object that contains e.g. the palette and typography for that color scheme.
   */
  colorSchemes: Record<ColorSchemeName, DeepPartial<ColorSchemeOptions>>;
  /**
   * Function that generates a CSS selector string for a given color scheme.
   * The browser applies the given styles only when the specified color scheme is active.
   * @example
   * makeStyles()(theme => ({
   *   root: {
   *     color: theme.palette.primary.main,
   *     ...theme.applyStyles('dark', {
   *       color: theme.palette.secondary.main,
   *     }),
   *   },
   * }))
   */
  applyStyles: ApplyStyles<ColorSchemeName>;
}

/**
 * A single fully-resolved color-scheme theme. Identical to {@link BaseTheme} except that its
 * `components` keep the nested `vars` level (the raw per-scheme token defaults produced by
 * `createComponents`), whereas the flattened `BaseTheme['components']` shape is only produced for
 * the final merged theme.
 */
export type ColorSchemeTheme = Omit<BaseTheme, 'components'> & { components: Components };

/**
 * A record of themes for each color scheme. Each key is a color scheme name (e.g., 'light', 'dark'),
 * and the value is a fully-resolved color-scheme theme ({@link ColorSchemeTheme}).
 */
export type ColorSchemeThemes = Record<ColorSchemeName, ColorSchemeTheme>

export type ThemeInternal = Omit<Theme, 'colorSchemes'> & {
  /**
   * Internal runtime map of fully resolved color-scheme themes.
   */
  colorSchemes: ColorSchemeThemes;
} & Pick<CreateCssVarsForColorSchemeThemesReturnValue, 'generateStyleSheets'> & {
  /**
   * Function that generates a CSS selector string for a given color scheme.
   */
  getColorSchemeSelector: GetColorSchemeSelector;
  /**
   * Function that switches the color scheme by the corresponding selector type.
   */
  setActiveColorScheme: ActiveColorSchemeSwitcher;
};
