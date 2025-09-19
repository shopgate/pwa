import createPalette from './createPalette';
import createBreakpoints from './createBreakpoints';
import createTypography from './createTypography';
import createSpacing from './createSpacing';
import transitions from './transitions';
import zIndex from './zIndex';

// eslint-disable-next-line valid-jsdoc
/**
 * Creates a theme object for the ThemeProvider.
 * @returns The theme object
 */
export const createTheme = (options = {}) => {
  const {
    typography: typographyInput = {},
  } = options;

  const palette = createPalette();
  const breakpoints = createBreakpoints();
  const spacing = createSpacing();

  const typography = createTypography(palette, typographyInput);

  return {
    palette,
    typography,
    breakpoints,
    spacing,
    transitions,
    zIndex,
  };
};
