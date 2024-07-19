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

  // Force cta colors
  if (!themeConfig.colors.cta && themeConfig.colors.primary) {
    themeConfig.colors.cta = themeConfig.colors.primary;
  }
  if (!themeConfig.colors.ctaContrast && themeConfig.colors.primaryContrast) {
    themeConfig.colors.ctaContrast = themeConfig.colors.primaryContrast;
  }
  return themeConfig;
}
