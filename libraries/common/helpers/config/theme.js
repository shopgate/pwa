import { themeConfig } from './mock';

/**
 * Provides a default theme config as a fallback.
 * @type {Object}
 */
const defaultConfig = {
  font: {},
  colors: {},
  variables: {},
};

/**
 * Builds the theme config.
 * @param {Object} appConfig The app config.
 * @returns {Object}
 */
export function getThemeConfig(appConfig) {
  if (process.env.NODE_ENV === 'test') {
    return themeConfig;
  }

  const { colors = {}, theme: { styles: { globals = {} } = {} } = {} } = appConfig;

  const oldTheme = process.env.THEME_CONFIG || defaultConfig;

  return {
    font: globals.font,
    colors: {
      ...globals.colors,
      ...colors,
    },
    variables: {
      ...(oldTheme.variables || {}),
      materialShadow: globals.variables.baseShadow,
    },
  };
}
