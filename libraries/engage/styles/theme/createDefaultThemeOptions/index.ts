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
          primary: '#212121',
          contrastDark: '#fff',
          contrastLight: '#212121',
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: '#F7ED00',
        },
        secondary: {
          main: '#00F7AA',
        },
        background: {
          default: '#000',
        },
        text: {
          primary: '#fff',
          contrastDark: '#fff',
          contrastLight: '#212121',
        },
      },
    },
  },
});
