import { logger } from '../../helpers';
import event from '../Event';
import { TYPE_TRUSTED } from '../../constants/Pipeline';
import * as requestTypes from '../../constants/RequestTypes';
import * as appCommands from '../../constants/AppCommands';

const appConfig = process.env.APP_CONFIG || {};

/**
 * The BrowserConnector emulates the SGJavaScriptBridge within browser environments.
 * It routes supported app commands to Shopgate Connect which can mimic the behavior of the app.
 */
class BrowserConnector {
  /**
   * The constructor.
   * @param {string} [ip=process.env.IP] The IP of the dev server.
   * @param {number} [port=process.env.PORT] The port of the dev server.
   */
  constructor(ip = process.env.IP, port = process.env.PORT) {
    this.ip = ip;
    this.port = port;
    this.supportedCommands = [
      appCommands.COMMAND_SEND_PIPELINE_REQUEST,
      appCommands.COMMAND_SEND_HTTP_REQUEST,
      appCommands.COMMAND_SEND_DATA_REQUEST,
      appCommands.COMMAND_GET_WEBSTORAGE_ENTRY,
    ];
    this.appConfig = appConfig;
  }

  /**
   * Builds the GET query.
   * @param {Object} input The input parameters.
   * @return {string}
   */
  buildQueryString = (input) => {
    if (Object.keys(input).length === 0 || this.isPOST) {
      return '';
    }

    const query = Object.keys(input).map(key => (`${key}=${input[key]}`)).join('&');
    return `?${query}`;
  }

  /**
   * @return {string}
   */
  get requestType() {
    if (!this.isPipelineRequest) {
      return requestTypes.REQUEST_TYPE_POST;
    }

    const segments = this.command.p.name.split('.');

    if (segments[2].startsWith('get')) {
      return requestTypes.REQUEST_TYPE_GET;
    }

    return requestTypes.REQUEST_TYPE_POST;
  }

  /**
   * @return {boolean}
   */
  get isGET() {
    return (this.requestType === requestTypes.REQUEST_TYPE_GET);
  }

  /**
   * @return {boolean}
   */
  get isPOST() {
    return (this.requestType === requestTypes.REQUEST_TYPE_POST);
  }

  /**
   * @return {string}
   */
  get connectUrl() {
    const { apiUrl = '' } = this.appConfig;
    const { name, type, input } = this.command.p;
    const queryString = this.buildQueryString(input);

    if (type && type === TYPE_TRUSTED) {
      return `${apiUrl}app/trustedPipelines/${name}${queryString}`;
    }

    return `${apiUrl}app/pipelines/${name}${queryString}`;
  }

  /**
   * @return {boolean}
   */
  get isPipelineRequest() {
    return (this.command.c === appCommands.COMMAND_SEND_PIPELINE_REQUEST);
  }

  /**
   * @return {string}
   */
  get suffix() {
    if (this.command.c === appCommands.COMMAND_GET_WEBSTORAGE_ENTRY) {
      return 'web_storage';
    }

    if (this.command.c === appCommands.COMMAND_SEND_HTTP_REQUEST) {
      return 'http_request';
    }

    return '';
  }

  /**
   * @return {string}
   */
  get localURL() {
    return `http://${this.ip}:${this.port}/${this.suffix}`;
  }

  /**
   * @param {string} libVersion The library version.
   * @returns {string}
   */
  getRequestBody(libVersion) {
    if (this.isPipelineRequest) {
      const { p } = this.command;
      const { input } = p;

      return JSON.stringify(input);
    }

    return JSON.stringify({
      cmds: [this.command],
      ver: libVersion,
    });
  }

  /**
   * Dispatches a single command to the dev server.
   * @param {Object} command The command to dispatch.
   * @param {string} libVersion The lib version for the command.
   * @return {BrowserConnector}
   */
  dispatchCommandForVersion(command, libVersion) {
    this.command = command;
    const { c: name } = this.command || {};

    if (this.supportedCommands.includes(name)) {
      const URL = this.isPipelineRequest ? this.connectUrl : this.localURL;
      const options = {
        method: this.requestType,
        credentials: 'include',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        ...this.isPOST && {
          body: this.getRequestBody(libVersion),
        },
      };

      fetch(URL, options)
        .then(response => response.json())
        .then(this.processResponse)
        .catch(err => err && logger.error(err));
    }

    return this;
  }

  /**
   * Handles a response of the server.
   * @param {Object} response The server response.
   * @return {BrowserConnector}
   */
  processResponse = (response) => {
    const { cmds = [] } = response || {};

    if (cmds.length === 0) {
      if (this.command.c === appCommands.COMMAND_SEND_PIPELINE_REQUEST) {
        event.call(`pipelineResponse:${this.command.p.serial}`, [
          response.error || null,
          this.command.p.serial,
          (!response.error ? response : undefined),
        ]);
      }
    }

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

export default BrowserConnector;
