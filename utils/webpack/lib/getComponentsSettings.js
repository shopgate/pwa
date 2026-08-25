const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const importFresh = require('import-fresh');
const { isDev } = require('./variables');

const ENGAGE_PACKAGE = '@shopgate/engage';
const WIDGET_CONFIG_FILE = 'config.json';
const WIDGET_CONFIG_SCHEMA = '@shopgate/engage/page/widget.config.schema.json';

/**
 * Raised when a widget ships a config file that cannot be used. It travels through the catch-all
 * of the exported function, so that a broken config fails the build instead of silently removing
 * every component mapping of the app.
 */
class WidgetConfigError extends Error {}

/**
 * @typedef {Object} ComponentSettingsEntry
 * @property {string} path Path to the file to be imported
 */

/**
 * @typedef {Object.<string, ComponentSettingsEntry>} ComponentSettingsMap
 */

/**
 * @typedef {Object} ComponentSettings
 * @property {ComponentSettingsMap} [portals] Portal component mapping
 * @property {ComponentSettingsMap} [translations] Translation file mapping
 * @property {ComponentSettingsMap} [tracking] Tracking plugin mapping
 * @property {ComponentSettingsMap} [subscribers] RxJS subscriber mapping
 * @property {ComponentSettingsMap} [reducers] Redux reducer mapping
 * @property {ComponentSettingsMap} [widgets] Widget component mapping
 * @property {ComponentSettingsMap} [widgetsV2] Widget component mapping for version 2 of the widget
 * system
 */

const ignoredExtensions = [
  '@shopgate/product-reviews',
];

/**
 * Removes ignored extension entries from one config section.
 * @param {Object} section The component settings section.
 * @returns {Object}
 */
const filterIgnoredEntries = (section = {}) => Object.keys(section).reduce((acc, key) => {
  const isIgnored = ignoredExtensions.some(ignored => key.startsWith(`${ignored}/`));

  if (isIgnored) {
    return acc;
  }

  return {
    ...acc,
    [key]: section[key],
  };
}, {});

/**
 * Removes ignored extension entries from component config sections that come from the sdk.
 * @param {ComponentSettings} config The raw component settings.
 * @returns {ComponentSettings}
 */
const filterIgnoredExtensions = (config = {}) => Object.keys(config).reduce((acc, sectionName) => ({
  ...acc,
  [sectionName]: filterIgnoredEntries(config[sectionName]),
}), {});

/**
 * Loads a JSON config file using `import-fresh`, if it exists.
 * @param {string} configPath - The absolute path to the config file.
 * @returns {Object} The imported configuration object, or an empty object if the file doesn't
 * exist.
 */
const loadConfig = configPath => (
  fs.existsSync(configPath) || configPath.startsWith(ENGAGE_PACKAGE) ?
    importFresh(configPath) :
    {}
);

/**
 * Reads the component mappings of the theme, without the config files that widgets provide.
 * @param {string} themePath The path of the theme.
 * @returns {ComponentSettings}
 */
const readComponentsConfig = (themePath) => {
  /** @type {ComponentSettings} */
  const defaultConfig = filterIgnoredExtensions(
    importFresh(path.join(themePath, 'config', 'components.json'))
  );

  return {
    ...defaultConfig,
    widgets: {
      ...defaultConfig.widgets,
      ...loadConfig(path.join(themePath, 'widgets', 'widgets.json')),
    },
    widgetsV2: {
      // To enable backwards compatibility for custom legacy widgets that are provided by
      // extensions we include them in the list of V2 widgets.
      ...defaultConfig.widgets,
      ...defaultConfig.widgetsV2,
      ...loadConfig(`${ENGAGE_PACKAGE}/page/widgets/widgets.json`),
    },
  };
};

const validateWidgetConfig = new Ajv({ allErrors: true })
  .compile(importFresh(WIDGET_CONFIG_SCHEMA));

/**
 * Builds the list of locations the config file of a widget can live at. Widgets provided by the
 * PWA are referenced by their package path, widgets provided by extensions relative to the
 * extensions folder of the app.
 * @param {string} componentPath Path of the widget from the components config.
 * @param {string} themePath The path of the theme.
 * @returns {string[]}
 */
const getWidgetConfigPaths = (componentPath, themePath) => {
  if (componentPath.startsWith(ENGAGE_PACKAGE)) {
    const packageRoot = path.dirname(require.resolve(`${ENGAGE_PACKAGE}/package.json`));
    const subPath = componentPath.slice(ENGAGE_PACKAGE.length + 1);

    return [path.join(packageRoot, subPath, WIDGET_CONFIG_FILE)];
  }

  const relativePaths = [componentPath];

  if (isDev) {
    // Extensions that are attached as a build are read from their sources while developing. The
    // Set keeps a single entry for the extensions that are attached as sources anyway.
    relativePaths.unshift(componentPath.replace('/dist/', '/src/'));
  }

  return Array.from(new Set(relativePaths)).map(relativePath => path.resolve(
    themePath,
    '..',
    '..',
    'extensions',
    relativePath,
    WIDGET_CONFIG_FILE
  ));
};

/**
 * Loads the config file of a single widget. Widgets are not required to provide one.
 * @param {string} componentPath Path of the widget from the components config.
 * @param {string} themePath The path of the theme.
 * @returns {Object} Config of the widget, or an empty object.
 */
const loadWidgetConfig = (componentPath, themePath) => {
  if (!componentPath) {
    return {};
  }

  const config = getWidgetConfigPaths(componentPath, themePath)
    .reduce((loaded, configPath) => {
      if (loaded) {
        return loaded;
      }

      try {
        return importFresh(configPath);
      } catch (e) {
        // A widget is not required to bring a config file. Anything else means it brought one that
        // cannot be read, which the author needs to hear about.
        if (e.code === 'MODULE_NOT_FOUND') {
          return null;
        }

        throw new WidgetConfigError(`Widget config "${configPath}" could not be read: ${e.message}`);
      }
    }, null);

  if (!config) {
    return {};
  }

  if (!validateWidgetConfig(config)) {
    throw new WidgetConfigError([
      `Widget config of "${componentPath}" is invalid:`,
      ...validateWidgetConfig.errors.map(error => `  ${error.instancePath || '/'} ${error.message}`),
    ].join('\n'));
  }

  // Only known sections are taken over, so that editor helpers like "$schema" don't end up in the
  // config that is injected into the app.
  return config.layout ? { config: { layout: config.layout } } : {};
};

/**
 * Adds the config every widget provides via its own config file to the widget entries.
 * @param {ComponentSettingsMap} widgets The widget entries from the components config.
 * @param {string} themePath The path of the theme.
 * @returns {ComponentSettingsMap}
 */
const withWidgetConfigs = (widgets, themePath) => Object.keys(widgets).reduce((acc, id) => ({
  ...acc,
  [id]: {
    ...widgets[id],
    ...loadWidgetConfig((widgets[id] || {}).path, themePath),
  },
}), {});

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
    const components = readComponentsConfig(themePath);

    return {
      ...components,
      widgetsV2: withWidgetConfigs(components.widgetsV2, themePath),
    };
  } catch (e) {
    if (e instanceof WidgetConfigError) {
      throw e;
    }

    return {};
  }
};

/**
 * Returns the widget config files the component settings are built from, so that a build can watch
 * them. Files that do not exist yet are reported separately, because webpack needs to know about
 * them to notice when a widget gets a config for the first time.
 *
 * The configs themselves are not read here. A broken one is supposed to surface while a module is
 * built, not while the webpack config is put together.
 *
 * @param {string} themePath The path of the theme.
 * @returns {{ fileDependencies: string[], missingDependencies: string[] }}
 */
module.exports.getWidgetConfigDependencies = (themePath) => {
  try {
    const { widgetsV2 = {} } = readComponentsConfig(themePath);

    const configPaths = Object.keys(widgetsV2).reduce((acc, id) => {
      const { path: componentPath } = widgetsV2[id] || {};

      if (!componentPath) {
        return acc;
      }

      return [...acc, ...getWidgetConfigPaths(componentPath, themePath)];
    }, [path.resolve(themePath, 'config', 'components.json')]);

    return {
      fileDependencies: configPaths.filter(configPath => fs.existsSync(configPath)),
      missingDependencies: configPaths.filter(configPath => !fs.existsSync(configPath)),
    };
  } catch (e) {
    return {
      fileDependencies: [],
      missingDependencies: [],
    };
  }
};
