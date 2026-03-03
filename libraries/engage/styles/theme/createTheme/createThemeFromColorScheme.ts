import createPalette from './createPalette';
import createTypography from './createTypography';
import createComponents from './createComponents';
import type { ColorSchemeOptions, BaseTheme } from './types';

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

  return {
    palette,
    typography,
    components,
  };
};

export default createThemeFromColorScheme;
