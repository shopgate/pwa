import { getCSSCustomProp } from '@shopgate/engage/styles';

/**
 * @typedef {import('../index').Theme['palette']} Palette
 */

/**
 * @returns {Palette} The legacy palette object.
 */
export const createLegacyPalette = () => {
  console.warn('THEME: creating legacy palette');

  return {
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
  };
};
