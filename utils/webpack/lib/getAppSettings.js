const importFresh = require('import-fresh');

/**
 * @typedef {import('../../../themes/theme-ios11/config/app.json')} AppSettings
 */

/**
 * Returns the app settings from the remote project.
 * @param {string} themePath The path to the theme.
 * @return {AppSettings} The app settings.
 */
module.exports = function getAppSettings(themePath) {
  try {
    return importFresh(`${themePath}/config/app.json`);
  } catch (e) {
    return {};
  }
};
