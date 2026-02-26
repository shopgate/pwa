import createPalette from './createPalette';
import createTypography from './createTypography';

/** @typedef {import('./index').ColorSchemeOptions} ColorSchemeOptions */
/** @typedef {import('./index').BaseTheme} BaseTheme */

/**
 * Creates a theme object for a given color scheme (light or dark).
 * @param {ColorSchemeOptions} colorScheme The color scheme options.
 * @returns {BaseTheme}
 */
const createThemeFromColorScheme = (colorScheme) => {
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
