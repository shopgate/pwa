import { getCSSCustomProp } from '@shopgate/engage/styles';
import type { ThemeOptions } from '../createTheme';

/**
 * Creates the default theme options with legacy palette values.
 * @returns The theme object
 */
export const createDefaultThemeOptions = (): ThemeOptions => ({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: getCSSCustomProp('--color-primary'),
        },
        secondary: {
          main: getCSSCustomProp('--color-secondary'),
        },
        error: {
          main: getCSSCustomProp('--color-state-alert'),
        },
        warning: {
          main: getCSSCustomProp('--color-state-warning'),
        },
        success: {
          main: getCSSCustomProp('--color-state-ok'),
        },
        background: {
          default: '#fff',
        },
        text: {
          primary: getCSSCustomProp('--color-text-high-emphasis'),
          secondary: getCSSCustomProp('--color-text-medium-emphasis'),
        },
      },
    },
    dark: {
      palette: {
        background: {
          default: '#000',
        },
        text: {
          primary: '#fff',
          secondary: '#808080',
        },
      },
    },
  },
});
