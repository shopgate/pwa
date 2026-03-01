import createPalette from './createPalette';
import createTypography from './createTypography';
import type { ColorSchemeOptions, BaseTheme } from './types';

/**
 * Creates a theme object for a given color scheme (light or dark).
 * @param colorScheme The color scheme options.
 */
const createThemeFromColorScheme = (colorScheme: ColorSchemeOptions): BaseTheme => {
  const {
    palette: paletteInput = {},
    typography: typographyInput = {},
  } = colorScheme;

  const palette = createPalette(paletteInput);
  const typography = createTypography(palette, typographyInput);

  return {
    palette,
    typography,
  };
};

export default createThemeFromColorScheme;
