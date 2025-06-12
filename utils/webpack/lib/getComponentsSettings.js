const fs = require('fs');
const importFresh = require('import-fresh');

/**
 * @typedef {Object} ComponentSettingsEntry
 * @property {string} path Path to the file to be imported
 */

/**
 * @typedef {Object.<string, ComponentSettingsEntry>} ComponentSettingsMap
 */

/**
 * @typedef {Object} ComponentSettings
 * @property {ComponentSettingsMap} portals Portal component mapping
 * @property {ComponentSettingsMap} translations Translation file mapping
 * @property {ComponentSettingsMap} tracking Tracking plugin mapping
 * @property {ComponentSettingsMap} subscribers RxJS subscriber mapping
 * @property {ComponentSettingsMap} reducers Redux reducer mapping
 * @property {ComponentSettingsMap} widgets Widget component mapping
 * @property {ComponentSettingsMap} widgetsV2 Widget component mapping for version 2 of the widget
 * system
 */

/**
 * Returns contents of the `config/components.json` file from the theme.
 *
 * This file is created by the SDK during startup and contains mappings for different types of
 * resources provided by attached extensions (portals, translations, widgets...).
 * The ShopgateIndexer Webpack plugin uses this file to generate different mapping files inside
 * the `extensions` folder of the theme. Those files contains import declarations to enable loading
 * of the different resources.
 *
 * Additionally it merges the widgets provided by the PWA into its return value.
 *
 * @param {string} themePath The path of the theme.
 * @return {ComponentSettings} The app settings.
 */
module.exports = function getComponentsSettings(themePath) {
  try {
    const themeWidgetsPath = `${themePath}/widgets`;

    const themeWidgetsV1Config = `${themeWidgetsPath}/widgets.json`;
    const themeWidgetsV2Config = '@shopgate/engage/page/widgets/widgets.json';

    /** @type {ComponentSettings} */
    const defaultConfig = importFresh(`${themePath}/config/components.json`);

    /**
     * Loads a JSON config file using `import-fresh`, if it exists.
     *
     * @param {string} path - The absolute path to the config file.
     * @returns {Object} The imported configuration object, or an empty object if the file doesn't
     * exist.
     */
    const loadConfig = path => (fs.existsSync(path) || path.startsWith('@shopgate/engage') ?
      importFresh(path) :
      {}
    );

    return {
      ...defaultConfig,
      widgets: {
        ...defaultConfig.widgets,
        ...loadConfig(themeWidgetsV1Config),
      },
      widgetsV2: {
        ...defaultConfig.widgetsV2,
        ...loadConfig(themeWidgetsV2Config),
      },
    };
  } catch (e) {
    return {};
  }
};
