import createBreakpoints from './createBreakpoints';
import createSpacing from './createSpacing';

// eslint-disable-next-line valid-jsdoc
/**
 * Creates a theme object for the ThemeProvider.
 * @returns The theme object
 */
export const createTheme = () => {
  const breakpoints = createBreakpoints();
  const spacing = createSpacing();

  return {
    breakpoints,
    spacing,
  };
};
