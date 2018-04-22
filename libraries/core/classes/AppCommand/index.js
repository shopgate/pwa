/* global SGJavascriptBridge */
import { logger, hasSGJavaScriptBridge } from '../../helpers';
import { isValidVersion, getLibVersion, isVersionAtLeast } from '../../helpers/version';
import logGroup from '../../helpers/logGroup';
import DevServerBridge from '../DevServerBridge';

/**
 * The app command class.
 */
class AppCommand {
  /**
   * @param {boolean} log Whether the command will be logged.
   * @param {boolean} checkLibVersion Whether the lib version will be checked before dispatch.
   */
  constructor(log = true, checkLibVersion = true) {
    this.log = log;
    this.checkLibVersion = checkLibVersion;
    this.name = '';
    this.params = null;
    this.libVersion = '9.0';
    this.commandsWithoutLog = [
      'sendPipelineRequest',
      'sendHttpRequest',
      'getWebStorageEntry',
    ];
  }

  /**
   * Sets the command name.
   * @param {string} name The command name.
   * @return {AppCommand}
   */
  setCommandName(name) {
    if (typeof name === 'string') {
      this.name = name;
    } else {
      logger.error('Invalid command name', name);
    }

    return this;
  }

  /**
   * Sets the command params.
   * @param {Object} [params=null] The command params.
   * @return {AppCommand}
   */
  setCommandParams(params) {
    if (params && typeof params === 'object' && params.constructor === Object) {
      this.params = params;
    } else {
      logger.error('Invalid command params', params);
    }

    return this;
  }

  /**
   * Sets the minimum required shopgate lib version for the command.
   * @param {string} libVersion The library version.
   * @return {AppCommand}
   */
  setLibVersion(libVersion) {
    if (isValidVersion(libVersion)) {
      this.libVersion = libVersion;
    } else {
      logger.error('Invalid lib version', libVersion);
    }

    return this;
  }

  /**
   * Logs the command to the console.
   * @private
   * @return {AppCommand}
   */
  logCommand() {
    if (this.log && !this.commandsWithoutLog.includes(this.name)) {
      const title = `AppCommand %c${this.name}`;

      logGroup(title, this.params || {}, '#8e44ad');
    }

    return this;
  }

  /**
   * Creates the command object which will be dispatched through the JavaScript bridge.
   * @private
   * @return {Object|null}
   */
  buildCommand() {
    let command = null;
    if (this.name) {
      command = {
        c: this.name,
        ...this.params && { p: this.params },
      };
    }

    return command;
  }

  /**
   * Dispatches the command to the app.
   * The returned promise will not be rejected for now in error cases to avoid the necessity
   * of refactoring within existing code. But it resolves with FALSE in those cases.
   * @param {Object} params The command params.
   * @return {Promise}
   */
  async dispatch(params) {
    if (params) {
      this.setCommandParams(params);
    }

    const command = this.buildCommand();

    // Only proceed if the command is valid.
    if (command === null) {
      logger.error('Command dispatch without command name');
      return false;
    }

    let appLibVersion = this.libVersion;
    let appHasSupport = true;

    // Perform a libVersion check if the flag is active.
    if (this.checkLibVersion === true) {
      // Gather the libVersion of the app and check if it supports the command.
      appLibVersion = await getLibVersion();
      appHasSupport = isVersionAtLeast(this.libVersion, appLibVersion);
    }

    // Only proceed if the command is supported by the app.
    if (appHasSupport === false) {
      logger.warn(`Command "${this.name}" is not supported by LibVersion of the app (required ${this.libVersion} | current ${appLibVersion})`);
      return false;
    }

    let bridge;

    /* istanbul ignore else */
    if (!hasSGJavaScriptBridge()) {
      // Inject the Frontend SDK bridge.
      bridge = new DevServerBridge();
    } else {
      bridge = SGJavascriptBridge;
    }

    try {
      /* istanbul ignore else */
      if ('dispatchCommandsForVersion' in bridge) {
        bridge.dispatchCommandsForVersion([command], appLibVersion);
      } else {
        bridge.dispatchCommandsStringForVersion(
          JSON.stringify([command]),
          appLibVersion
        );
      }

      this.logCommand();
    } catch (exception) {
      logger.error(exception);
      return false;
    }

    return true;
  }
}

export default AppCommand;
