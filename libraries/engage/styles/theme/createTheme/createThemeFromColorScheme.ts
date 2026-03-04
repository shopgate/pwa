import createPalette from './createPalette';
import createTypography from './createTypography';
import createComponents from './createComponents';
import type { ColorSchemeOptions, BaseTheme } from './types';

/**
 * Calculates the percentage value for a given coefficient, which can be a number or a string representing a CSS calculation.
 * @param coefficient The coefficient to convert, either a number or a string.
 * @returns A string representing the percentage value of the coefficient.
 */
const coefficientToPercentage = (coefficient: number | string): string => {
  if (typeof coefficient === 'number') {
    return `${(coefficient * 100).toFixed(0)}%`;
  }
  return `calc((${coefficient}) * 100%)`;
};

/**
 * Helper function to add an alpha value to a color.
 * @param color The color to modify.
 * @param coefficient The alpha coefficient to apply, either a number or a string representing a CSS calculation.
 * @returns A string representing the color with the applied alpha value.
 */
export const alpha = (
  color: string,
  coefficient: number | string
): string => `oklch(from ${color} l c h / ${typeof coefficient === 'string' ? `calc(${coefficient})` : coefficient})`;

/**
 * Helper function to lighten a color by a given coefficient.
 * @param color The color to modify.
 * @param coefficient The coefficient to apply, either a number or a string representing a CSS calculation.
 * @returns A string representing the lightened color.
 */
export const lighten = (
  color: string,
  coefficient: number | string = 0.2
): string => `color-mix(in oklch, ${color}, #fff ${coefficientToPercentage(coefficient)})`;

/**
 * Helper function to darken a color by a given coefficient.
 * @param color The color to modify.
 * @param coefficient The coefficient to apply, either a number or a string representing a CSS calculation.
 * @returns A string representing the darkened color.
 */
export const darken = (
  color: string,
  coefficient: number | string = 0.2
): string => `color-mix(in oklch, ${color}, #000 ${coefficientToPercentage(coefficient)})`;

/**
 * Creates a theme object for a given color scheme (light or dark).
 * @param colorScheme The color scheme options.
 * @returns A theme object for the given color scheme.
 */
const createThemeFromColorScheme = (colorScheme: ColorSchemeOptions): BaseTheme => {
  const {
    palette: paletteInput = {},
    typography: typographyInput = {},
    components: componentsInput = {},
  } = colorScheme;

  const palette = createPalette(paletteInput);

  const typography = createTypography(palette, typographyInput);
  const components = createComponents(componentsInput);

  const theme = {
    palette,
    typography,
    components,
    alpha,
    lighten,
    darken,
  };

  return theme;
};

export default createThemeFromColorScheme;
