import { logger, hasSGJavaScriptBridge } from '../../helpers';
import { isValidVersion, getLibVersion, isVersionAtLeast } from '../../helpers/version';
import logGroup from '../../helpers/logGroup';
import * as appCommands from '../../constants/AppCommands';
import Bridge from '../Bridge';

/**
 * The app command class.
 */
class AppCommand {
  /**
   * @param {boolean} log Whether the command will be logged.
   * @param {boolean} checkLibVersion Whether the lib version will be checked before dispatch.
   */
  constructor(log = true, checkLibVersion = hasSGJavaScriptBridge()) {
    this.log = log;
    this.checkLibVersion = checkLibVersion;
    this.name = '';
    this.params = null;
    this.libVersion = '9.0';
    this.commandsWithoutLog = [
      appCommands.COMMAND_SEND_PIPELINE_REQUEST,
      appCommands.COMMAND_SEND_HTTP_REQUEST,
      appCommands.COMMAND_GET_WEBSTORAGE_ENTRY,
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
   * @return {Object|null}
   */
  buildCommand() {
    const command = this.name ? {
      c: this.name,
      ...this.params && { p: this.params },
    } : null;

    return command;
  }

  /**
   * Dispatches the command to the app.
   * The returned promise will not be rejected for now in error cases to avoid the necessity
   * of refactoring within existing code. But it resolves with FALSE in those cases.
   * @param {Object} [params] The command params.
   * @return {Promise<boolean>}
   */
  async dispatch(params) {
    if (params) {
      this.setCommandParams(params);
    }

    const command = this.buildCommand();

    // Only proceed if the command is valid.
    if (command === null) {
      logger.error(`Dispatch aborted for invalid command. name: "${this.name}" | params:`, this.params);
      return false;
    }

    let appLibVersion = this.libVersion;
    let appHasSupport = true;

    // Perform a libVersion check if the flag is active.
    if (this.checkLibVersion) {
      // Gather the libVersion of the app and check if it supports the command.
      appLibVersion = await getLibVersion();
      appHasSupport = isVersionAtLeast(this.libVersion, appLibVersion);
    }

    // Only proceed if the command is supported by the app.
    if (!appHasSupport) {
      logger.warn(`The command "${this.name}" is not supported by LibVersion (required ${this.libVersion} | current ${appLibVersion})`);
      return false;
    }

    const bridge = new Bridge();

    try {
      bridge.dispatchCommand(command, appLibVersion);
      this.logCommand();
    } catch (exception) {
      logger.error(exception);
      return false;
    }

    return true;
  }
}

export default AppCommand;
