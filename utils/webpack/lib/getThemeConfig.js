const Color = require('color');
const importFresh = require('import-fresh');

/**
 * Calculates a contrast color for a given background color.
 * The color will either be black or white depending on the perceived
 * luminosity of the background color.
 * @param {string} bgColor The background color.
 * @param {Object} colors The full color variables.
 * @returns {string} The contrast color.
 */
function getContrastColor(bgColor, colors) {
  // We set a rather high cutoff to prefer light text if possible.
  const cutoff = 0.74;

  // Calculate the perceived luminosity (relative brightness) of the color.
  const perceivedLuminosity = Color(bgColor).luminosity();

  return perceivedLuminosity >= cutoff ? colors.dark : colors.light;
}

/**
 * Gets the default focus color. This usually is the themes primary color.
 * However, if this color is too bright, the result of ths method
 * will fall back to the accent color.
 * @param {Object} colors The full color variables.
 * @return {string} The color.
 */
function getFocusColor(colors) {
  if (Color(colors.primary).luminosity() >= 0.8) {
    return colors.accent;
  }

  return colors.primary;
}

/**
 * Applies the contrast and focus colors to the colors configuration.
 * @param {Object} config The complete theme configuration.
 * @return {Object}
 */
function applyContrastColors(config) {
  const { colors } = config;

  return {
    ...config,
    colors: {
      ...colors,
      primaryContrast: getContrastColor(colors.primary, colors),
      accentContrast: getContrastColor(colors.accent, colors),
      focus: getFocusColor(colors),
    },
  };
}

/**
 * Applies custom colors
 * @param {[type]} config [description]
 * @param {Object} appSettings The application settings.
 * @return {[type]} [description]
 */
function applyCustomColors(config, appSettings) {
  const { colors } = appSettings;

  if (!config.hasOwnProperty('colors')) {
    return {
      ...config,
      colors,
    };
  }

  return {
    ...config,
    colors: {
      ...config.colors,
      ...colors,
    },
  };
}

/**
 * Returns the app settings from the remote project.
 * @param {string} themePath The path to the theme.
 * @param {Object} appSettings The application settings.
 * @return {Object} The app settings.
 */
module.exports = function getThemeConfig(themePath, appSettings) {
  try {
    const rawConfig = importFresh(`${themePath}/theme-config`);
    const config = applyCustomColors(rawConfig, appSettings);
    return applyContrastColors(config);
  } catch (e) {
    return {};
  }
};
