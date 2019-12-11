/* eslint-disable class-methods-use-this */
const path = require('path');
const fs = require('fs');
const {
  camelCase, has, upperFirst, isPlainObject,
} = require('lodash');
const { isDev } = require('../lib/variables');
const logger = require('../lib/logger');
const getComponentsSettings = require('../lib/getComponentsSettings');
const i18n = require('../lib/i18n');

const t = i18n(__filename);

const TYPE_WIDGETS = 'WIDGETS';
const TYPE_TRACKERS = 'TRACKERS';
const TYPE_PORTALS = 'PORTALS';
const TYPE_REDUCERS = 'REDUCERS';
const TYPE_SUBSCRIBERS = 'SUBSCRIBERS';
const TYPE_TRANSLATIONS = 'TRANSLATIONS';

const defaultFileContent = 'export default {};\n';
const themePath = process.cwd();

/**
 * Returns the extensions path inside the theme.
 * @return {string}
 */
function getExtensionsPath() {
  return path.resolve(themePath, 'extensions');
}

/**
 * Checks if the component exists.
 * @param {string} componentPath The component path.
 * @return {boolean}
 */
function componentExists(componentPath) {
  const existsInExtensions = fs.existsSync(path.resolve(themePath, '..', '..', 'extensions', componentPath));
  const existsInWidgets = fs.existsSync(path.resolve(themePath, 'widgets', componentPath));

  return !(!existsInExtensions && !existsInWidgets);
}

/**
 * Returns the generated component variable name.
 * @param {string} id The component ID.
 * @return {string}
 */
function getVariableName(id) {
  return upperFirst(camelCase(id.replace(/@/g, '').replace(/\//g, '-')));
}

/**
 * Reads the components config and creates import and export variables.
 * @param {Object} options The read config options.
 * @return {Object}
 */
function readConfig(options) {
  const {
    type,
    config,
    importsStart = null,
    importsEnd = null,
    exportsStart = 'export default {',
    exportsEnd = '};',
    isArray = false,
  } = options;

  if (!config || !isPlainObject(config)) {
    throw new TypeError(t('SUPPLIED_CONFIG_IS_NOT_AN_OBJECT', {
      typeofConfig: typeof config,
    }));
  }

  const imports = importsStart ? [importsStart] : []; // Holds the import strings.
  const exports = [exportsStart]; // Holds the export strings.

  // eslint-disable-next-line global-require, import/no-dynamic-require
  const themePackage = require(`${themePath}/package.json`);

  if (
    (type === TYPE_PORTALS || type === TYPE_WIDGETS) &&
    has(themePackage.dependencies, 'react-loadable')
  ) {
    imports.push('import { hot } from \'react-hot-loader/root\';');
    imports.push('import Loadable from \'react-loadable\';');
    imports.push('import Loading from \'@shopgate/pwa-common/components/Loading\';');
    imports.push('');
  }

  Object.keys(config).forEach((id) => {
    const component = config[id];
    const componentPath = isDev ? component.path.replace('/dist/', '/src/') : component.path;

    if (!componentExists(componentPath)) {
      return;
    }

    const variableName = getVariableName(id);

    const isPortalsOrWidgets = (
      (type === TYPE_PORTALS && component.target !== 'app.routes')
      || type === TYPE_WIDGETS
    );

    if (isPortalsOrWidgets && has(themePackage.dependencies, 'react-loadable')) {
      imports.push(`const ${variableName} = Loadable({\n  loader: () => import('${componentPath}'),\n  loading: Loading,\n});\n`);
    } else {
      imports.push(`import ${variableName} from '${componentPath}';`);
    }

    if (isArray) {
      exports.push(`  ${variableName},`);
      return;
    }

    if (isPortalsOrWidgets) {
      exports.push(`  '${id}': hot(${variableName}),`);
    } else {
      exports.push(`  '${id}': ${variableName},`);
    }
  });

  if (importsEnd) {
    imports.push(importsEnd);
  }

  exports.push(exportsEnd);

  return {
    imports,
    exports,
  };
}

/**
 * Creates translations for the extension indexing log.
 * @param {string} type The indexed type.
 * @returns {Object}
 */
function getIndexLogTranslations(type = TYPE_WIDGETS) {
  const params = { type: t(`TYPE_${type}`) };

  return {
    logStart: `  ${t('INDEXING_TYPE', params)}`,
    logEnd: `  ${t('INDEXED_TYPE', params)}`,
    logNotFound: `  ${t('NO_EXTENSIONS_FOUND_FOR_TYPE', params)}`,
  };
}

/**
 * Validates the extensions input.
 * @param {Object} input The input.
 * @return {Promise}
 */
function validateExtensions(input) {
  try {
    const extensionPath = getExtensionsPath();

    if (!fs.existsSync(extensionPath)) {
      fs.mkdirSync(extensionPath);
    }

    if (!input.imports.length) {
      return null;
    }

    return input;
  } catch (e) {
    throw new Error(t('EXTENSION_COULD_NOT_BE_VALIDATED'));
  }
}

/**
 * Creates the string that is written into the appropriate file.
 * @param {Object} input The input object.
 * @return {string}
 */
function createStrings(input) {
  try {
    if (!input) {
      return null;
    }

    const importsString = input.imports.length ? `${input.imports.join('\n')}\n\n` : '';
    const exportsString = input.exports.length ? `${input.exports.join('\n')}\n` : '';
    const indexString = `${importsString}${exportsString}`.replace('\n\n\n', '\n\n');

    return indexString.length ? indexString : null;
  } catch (e) {
    throw new Error(t('STRINGS_COULD_NOT_BE_CREATED'));
  }
}

/**
 * Writes to extension file.
 * @param {Object} options The action object.
 */
function writeExtensionFile(options) {
  const {
    file,
    input,
    defaultContent,
    logNotFound,
    logEnd,
  } = options;
  const filePath = path.resolve(getExtensionsPath(), file);

  if (!input) {
    logger.warn(logNotFound);
    fs.writeFileSync(filePath, defaultContent, { flag: 'w+' });
    return;
  }

  fs.writeFileSync(filePath, input, { flag: 'w+' });
  logger.log(logEnd);
}

/**
 * Creates an index.
 * @param {Object} options The indexing options,
 */
function index(options) {
  const {
    file,
    config,
    logStart,
    logNotFound,
    logEnd,
    defaultContent = defaultFileContent,
  } = options;

  logger.log(logStart);

  const input = readConfig(config);
  const validationInput = validateExtensions(input);
  const stringsInput = createStrings(validationInput);

  writeExtensionFile({
    input: stringsInput,
    file,
    defaultContent,
    logNotFound,
    logEnd,
  });
}

/**
 * Indexes the widgets.
 */
function indexWidgets() {
  const { widgets = {} } = getComponentsSettings(themePath);

  index({
    file: 'widgets.js',
    config: {
      type: TYPE_WIDGETS,
      config: widgets,
    },
    ...getIndexLogTranslations(TYPE_WIDGETS),
  });
}

/**
 * Indexes the tracking.
 */
function indexTracking() {
  const { tracking = {} } = getComponentsSettings(themePath);

  index({
    file: 'tracking.js',
    config: {
      type: TYPE_TRACKERS,
      config: tracking,
    },
    ...getIndexLogTranslations(TYPE_TRACKERS),
  });
}

/**
 * Indexes the portals.
 */
function indexPortals() {
  const { portals = {} } = getComponentsSettings(themePath);

  index({
    file: 'portals.js',
    config: {
      type: TYPE_PORTALS,
      config: portals,
      importsStart: 'import portalCollection from \'@shopgate/pwa-common/helpers/portals/portalCollection\';',
      exportsStart: 'portalCollection.registerPortals({',
      exportsEnd: '});',
    },
    ...getIndexLogTranslations(TYPE_PORTALS),
  });
}

/**
 * Indexes the reducers from extensions.
 */
function indexReducers() {
  const { reducers = {} } = getComponentsSettings(themePath);

  index({
    file: 'reducers.js',
    config: {
      type: TYPE_REDUCERS,
      config: reducers,
    },
    defaultContent: 'export default null;\n',
    ...getIndexLogTranslations(TYPE_REDUCERS),
  });
}

/**
 * Indexes the RxJS subscriptions from extensions.
 */
function indexSubscribers() {
  const { subscribers = {} } = getComponentsSettings(themePath);

  index({
    file: 'subscribers.js',
    config: {
      type: TYPE_SUBSCRIBERS,
      config: subscribers,
      exportsStart: 'export default [',
      exportsEnd: '];',
      isArray: true,
    },
    defaultContent: 'export default [];\n',
    ...getIndexLogTranslations(TYPE_SUBSCRIBERS),
  });
}

/**
 * Indexes the translations from extensions.
 */
function indexTranslations() {
  const { translations = {} } = getComponentsSettings(themePath);

  index({
    file: 'translations.js',
    config: {
      type: TYPE_TRANSLATIONS,
      config: translations,
    },
    defaultContent: 'export default null;\n',
    ...getIndexLogTranslations(TYPE_TRANSLATIONS),
  });
}

exports.createIndexes = function createIndexes() {
  try {
    logger.log('');
    indexWidgets();
    indexTracking();
    indexPortals();
    indexReducers();
    indexSubscribers();
    indexTranslations();
    logger.log('');
  } catch (err) {
    logger.log(err);
    process.exit(1);
  }
};

/**
 * Runs the indexer.
 */
class ShopgateIndexerPlugin {
  /**
   * @param {Object} compiler The webpack compiler
   */
  apply(compiler) {
    const watcher = fs.watch(`${themePath}/config/components.json`, () => {
      exports.createIndexes();
    });

    process.on('exit', () => {
      watcher.close();
    });

    compiler.hooks.environment.tap('ShopgateIndexerPlugin', () => {
      exports.createIndexes();
    });
  }
}

module.exports = ShopgateIndexerPlugin;
/* eslint-enable class-methods-use-this */
