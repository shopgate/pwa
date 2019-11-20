/* eslint-disable no-console */
const { green, blue, bold } = require('chalk');
const i18n = require('./i18n');

const t = i18n(__filename);

/**
 * The Logger class hold static functions for logging useful information when running
 * the Rapid Dev Server and the Webpack Dev Server.
 * @type {LogHelper}
 */
class LogHelper {
  /**
   * LogHelper.
   */
  constructor() {
    /**
     * A divider for console outputs.
     * @type {string}
     */
    this.divider = '---------------------------------------------------------------------------\n';
    /**
     * A colored Shopgate Cloud prefix for console outputs.
     * @type {string}
     */
    this.prefix = `${green('Shopgate')}${blue('Connect')}`;
  }

  /**
   * Returns the divider.
   * @return {string}
   */
  getDivider() {
    return this.divider;
  }

  /**
   * Returns the Shopgate Cloud prefix
   * @return {string}
   */
  getPrefix() {
    return this.prefix;
  }

  /**
   * Logs the webpack startup.
   */
  logLogoStart() { // eslint-disable-line class-methods-use-this
    console.log(`  ${t('BUILD_STARTING', { server: bold(t('SERVER')) })}\n`);
  }

  /**
   * Logs the build logo.
   */
  logLogoBuild() {
    console.log(`\n${this.getDivider()}`);
    console.log(`  ${green('S H O P G A T E')}   ${blue('C O N N E C T')}`);
    console.log('  B U I L D\n');
  }

  /**
   * Logs if the build has successfully finished.
   */
  logBuildFinished() {
    console.log(`  ${t('BUILD_FINISHED', { prefix: green(t('PREFIX')) })}\n`);
    console.log(this.getDivider());
  }
}

module.exports = console;
module.exports.logHelper = new LogHelper();
/* eslint-enable no-console */
