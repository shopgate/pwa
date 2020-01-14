/* eslint-disable class-methods-use-this */
const path = require('path');
const Ajv = require('ajv');
const { green, blue, red } = require('chalk');
const logger = require('../lib/logger');
const i18n = require('../lib/i18n');

const t = i18n(__filename);

const sep = '\n---------------------------------------------------------------------------\n';

/**
 * Validates the theme configuration.
 */
class ShopgateThemeConfigValidatorPlugin {
  /**
   * @param {Object} compiler The webpack compiler
   */
  apply(compiler) {
    compiler.hooks.environment.tap('ShopgateIndexerPlugin', () => {
      logger.log(sep);
      logger.log(blue(`  ${t('VALIDATING_CONFIG')}`));
      const themePath = process.cwd();
      const ajv = new Ajv();
      // eslint-disable-next-line global-require, import/no-dynamic-require
      const schema = require(path.resolve(themePath, 'extension-config.schema.json'));
      // eslint-disable-next-line global-require, import/no-dynamic-require
      const config = require(path.resolve(themePath, 'config', 'app.json'));

      const valid = ajv.validate(schema, config);

      if (!valid) {
        logger.error(red(`\n  ${t('INVALID')}`));
        logger.error(JSON.stringify(ajv.errors, null, '  '));
        process.kill(process.pid, 'SIGINT');
        process.kill(process.ppid, 'SIGINT');
        process.exit(1);
        return;
      }

      logger.log(green(`\n  ${t('VALID')}`));
      logger.log(sep);
    });
  }
}

module.exports = ShopgateThemeConfigValidatorPlugin;
/* eslint-enable class-methods-use-this */
