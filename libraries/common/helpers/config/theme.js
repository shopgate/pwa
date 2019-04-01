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
export function getThemeConfig({ theme: { styles: { globals = {} } = {} } = {} } = {}) {
  if (process.env.NODE_ENV === 'test') {
    return themeConfig;
  }

  const oldTheme = process.env.THEME_CONFIG || defaultConfig;

  return {
    font: globals.font,
    colors: globals.colors,
    variables: {
      ...(oldTheme.variables || {}),
      materialShadow: globals.variables.baseShadow,
    },
  };
}
