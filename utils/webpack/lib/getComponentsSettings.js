const fs = require('fs');
const importFresh = require('import-fresh');

/**
 * Returns the app settings from the remote project.
 * @param {string} themePath The path of the theme.
 * @return {Object} The app settings.
 */
module.exports = function getComponentsSettings(themePath) {
  try {
    const themeWidgets = `${themePath}/widgets`;
    const themeConfig = `${themeWidgets}/widgets.json`;

    const defaultConfig = importFresh(`${themePath}/config/components.json`);

    const configExists = (fs.existsSync(themeWidgets) && fs.existsSync(themeConfig));
    const config = configExists ? importFresh(themeConfig) : {};

    return {
      ...defaultConfig,
      widgets: {
        ...defaultConfig.widgets,
        ...config,
      },
    };
  } catch (e) {
    return {};
  }
};
