import fetch from 'isomorphic-fetch';
import { logger } from '../../helpers';
import event from '../Event';

/**
 * The DevServerBridge emulates the SGJavaScriptBridge within browser environments.
 * It routes supported app commands to the Frontend SDK which can mimic the behavior of the app.
 */
class DevServerBridge {
  /**
   * The constructor.
   * @param {string} ip The IP of the dev server.
   * @param {number} port The port of the dev server.
   */
  constructor(ip = process.env.IP, port = process.env.PORT) {
    this.ip = ip;
    this.port = port;
    this.supportedCommands = [
      'sendPipelineRequest',
      'sendHttpRequest',
      'sendDataRequest',
      'getWebStorageEntry',
    ];
  }

  /**
   * Dispatches multiple commands to the dev server.
   * @param {Array} commands The commands to dispatch.
   * @param {string} libVersion The lib version for the command.
   * @return {DevServerBridge}
   */
  dispatchCommandsForVersion(commands, libVersion) {
    if (Array.isArray(commands)) {
      commands.forEach((command) => {
        this.dispatchCommandForVersion(command, libVersion);
      });
    }

    return this;
  }

  /**
   * Dispatches a single command to the dev server.
   * @param {Object} command The command to dispatch.
   * @param {string} libVersion The lib version for the command.
   * @return {DevServerBridge}
   */
  dispatchCommandForVersion(command, libVersion) {
    const { c: name } = command || {};

    if (this.supportedCommands.includes(name)) {
      // Append an optional suffix for special command related endpoints
      let suffix = '';

      if (name === 'getWebStorageEntry') {
        suffix = 'web_storage';
      } else if (name === 'sendHttpRequest') {
        suffix = 'http_request';
      }

      const url = `http://${this.ip}:${this.port}/${suffix}`;
      const options = {
        method: 'post',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          cmds: [command],
          ver: libVersion,
        }),
      };

      fetch(url, options)
        .then(response => response.json())
        .then(this.processDevServerResponse)
        .catch(err => err && logger.error(err));
    }

    return this;
  }

  /**
   * Handles a response of the dev server.
   * @param {Object} response The server response.
   * @return {DevServerBridge}
   */
  processDevServerResponse(response) {
    const { cmds = [] } = response || {};

    // Process the response commands.
    cmds.forEach((command) => {
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

    return this;
  }
}

export default DevServerBridge;
