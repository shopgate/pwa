import { themeConfig as mockConfig } from './mock';
import { assignObjectDeep } from '../data';

/**
 * Provides a default theme config as a fallback.
 * @type {Object}
 */
const defaultConfig = {
  typography: {},
  colors: {},
  variables: {},
  shadows: {},
};

/**
 * Builds and returns a new theme config object.
 * @param {Object} appConfig The app config.
 * @returns {Object}
 */
export function buildThemeConfig(appConfig) {
  if (process.env.NODE_ENV === 'test') {
    return mockConfig;
  }

  const { colors = {}, theme = {} } = appConfig;

  // Force cta colors
  if (!colors.cta && colors.primary) {
    colors.cta = colors.primary;
  }
  if (!colors.ctaContrast && colors.primaryContrast) {
    colors.ctaContrast = colors.primaryContrast;
  }

  const oldTheme = process.env.THEME_CONFIG || defaultConfig;

  const themeConfig = { ...theme };
  assignObjectDeep(themeConfig, {
    colors: {
      ...colors,
      /**
       * The SDK creates some colors dynamically and populates them via the THEME_CONFIG.
       * To avoid breaking changes, those colors also needs to be added for now.
       */
      ...oldTheme.colors,
    },
    variables: {
      ...(oldTheme.variables || {}),
      materialShadow: theme.shadows.material,
    },
  });

  return themeConfig;
}
