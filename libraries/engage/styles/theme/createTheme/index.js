import { breakpoints } from './breakpoints';
import { spacing } from './spacing';

// eslint-disable-next-line valid-jsdoc
/**
 * Creates a theme object for the ThemeProvider.
 * @returns The theme object
 */
export const createTheme = () => ({
  breakpoints,
  spacing,
});
