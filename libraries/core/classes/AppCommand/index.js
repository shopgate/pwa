/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* global SGJavascriptBridge */

import fetch from 'isomorphic-fetch';
import event from '../Event';
import { logger, hasSGJavaScriptBridge } from '../../helpers';
import logGroup from '../../helpers/logGroup';

/**
 * The app command class.
 */
class AppCommand {
  /**
   * @param {boolean} log Whether the command will be logged.
   */
  constructor(log = true) {
    this.log = log;
    this.command = {};
    this.libVersion = '9.0';
  }

  /**
   * Sets the command name.
   * @param {string} name The command name.
   * @returns {AppCommand}
   */
  setCommandName(name) {
    this.command.c = name;
    return this;
  }

  /**
   * Sets the command params.
   * @param {Object} [params=null] The command params.
   * @returns {AppCommand}
   */
  setCommandParams(params = null) {
    this.command.p = params;
    return this;
  }

  /**
   * Sets the library version of the app.
   * @param {string} libVersion The library version.
   * @returns {AppCommand}
   */
  setLibVersion(libVersion) {
    this.libVersion = libVersion;
    return this;
  }

  /**
   * Dispatches the command into the app.
   * @param {Object} [params=null] The command params.
   */
  dispatch(params = null) {
    if (params) {
      this.command.p = params;
    }

    if (hasSGJavaScriptBridge()) {
      try {
        if ('dispatchCommandsForVersion' in SGJavascriptBridge) {
          SGJavascriptBridge.dispatchCommandsForVersion([this.command], this.libVersion);
        } else {
          SGJavascriptBridge.dispatchCommandsStringForVersion(
            JSON.stringify([this.command]),
            this.libVersion
          );
        }

        this.logCommand();
      } catch (exception) {
        logger.error(exception);
      }
    } else {
      this.logCommand();

      const devServerCommands = [
        'sendPipelineRequest',
        'sendHttpRequest',
        'sendDataRequest',
        'getWebStorageEntry',
      ];

      // Only commands which represent a request are sent to the development server.
      if (devServerCommands.includes(this.command.c)) {
        this.sendDevCommand();
      }
    }
  }

  /**
   * Logs the command to the console.
   */
  logCommand() {
    if (
      !this.log ||
      this.command.c === 'sendPipelineRequest' ||
      this.command.c === 'sendHttpRequest' ||
      this.command.c === 'getWebStorageEntry'
    ) {
      return;
    }

    const title = `AppCommand %c${this.command.c}`;

    if (this.command.p) {
      logGroup(title, this.command.p, '#8e44ad');
    } else logGroup(title, {}, '#8e44ad');
  }

  /**
   * Sends the command to the development API.
   * @private
   */
  sendDevCommand() {
    // Append an optional suffix for special command related endpoints
    let suffix = '';

    if (this.command.c === 'getWebStorageEntry') {
      suffix = 'web_storage';
    } else if (this.command.c === 'sendHttpRequest') {
      suffix = 'http_request';
    }

    const url = `http://${process.env.IP}:${process.env.PORT}/${suffix}`;
    const options = {
      method: 'post',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({ cmds: [this.command] }),
    };

    fetch(url, options)
      .then(response => response.json())
      .then((response) => {
        if (!response.cmds.length) {
          return;
        }

        response.cmds.forEach((command) => {
          const name = command.c;
          const params = command.p;

          let args = [];

          /**
           * The server returns a response command for a request command.
           * If the native app receives such a command, it calls a related event within the
           * webviews. Here the response parameters are sorted in the specified order for
           * the different response events.
           */
          if (name === 'pipelineResponse') {
            args = [params.error, params.serial, params.output];
          } else if (name === 'httpResponse') {
            args = [params.error, params.serial, params.response];
          } else if (name === 'dataResponse') {
            args = [params.serial, params.status, params.body, params.bodyContentType];
          } else if (name === 'webStorageResponse') {
            args = [params.serial, params.age, params.value];
          }

          event.call(name, args);
        });
      })
      .catch(err => err && logger.error(err));
  }
}

export default AppCommand;
