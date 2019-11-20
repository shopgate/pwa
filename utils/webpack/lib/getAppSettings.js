const importFresh = require('import-fresh');

/**
 * Returns the app settings from the remote project.
 * @param {string} themePath The path to the theme.
 * @return {Object} The app settings.
 */
module.exports = function getAppSettings(themePath) {
  try {
    return importFresh(`${themePath}/config/app.json`);
  } catch (e) {
    return {};
  }
};
