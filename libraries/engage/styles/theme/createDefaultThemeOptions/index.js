import { getCSSCustomProp } from '@shopgate/engage/styles';

/**
 * @typedef {import('../createTheme').ThemeOptions} ThemeOptions
 */

/**
 * @returns {ThemeOptions} The theme object
 */
export const createDefaultThemeOptions = () => {
  console.warn('THEME: creating legacy palette');

  return {
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
          },
        },
      },
      dark: {
        palette: {
          primary: {
            main: '#ff0000',
          },
          background: {
            default: '#000',
          },
          text: {
            primary: '#fff',
          },
        },
      },
    },
  };
};
