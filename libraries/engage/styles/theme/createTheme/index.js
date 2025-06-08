import createBreakpoints from './createBreakpoints';
import createSpacing from './createSpacing';
import transitions from './transitions';
import zIndex from './zIndex';

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
    transitions,
    zIndex,
  };
};
