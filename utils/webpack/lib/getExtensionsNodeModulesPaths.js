const fs = require('fs');
const path = require('path');
const logger = require('./logger');
const i18n = require('./i18n');

const t = i18n(__filename);
const extensionPath = path.resolve(process.cwd(), '..', '..', 'extensions');

let extensions = {};

try {
  extensions = JSON.parse(process.env.extensions);
} catch (error) {
  // eslint-disable-next-line prefer-template
  logger.log('  ' + t('NO_EXTENSIONS_ATTACHED') + '\n');
}

/**
 * Returns the node modules paths to all extensions.
 * @return {Array}
 */
module.exports = function getExtensionsNodeModulePaths() {
  const paths = [];

  Object.keys(extensions).forEach((key) => {
    const extension = extensions[key];
    const fePathRelative = path.resolve(
      extensionPath,
      extension.path,
      'frontend',
      'node_modules'
    );
    const frontendPath = path.resolve(process.cwd(), fePathRelative);
    const exPathRelative = path.resolve(extensionPath, extension.path, 'node_modules');

    if (fs.existsSync(frontendPath)) {
      paths.push(frontendPath);
    }

    if (fs.existsSync(exPathRelative)) {
      paths.push(exPathRelative);
    }
  });

  return paths;
};
