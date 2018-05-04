import AppCommand from '../AppCommand';
import event from '../Event';
import * as processTypes from '../../constants/ProcessTypes';
import logGroup from '../../helpers/logGroup';

/**
 * Manages the pipeline's requests and responses.
 */
class PipelineManager {
  /**
   * Constructor.
   */
  constructor() {
    this.requests = new Map();
  }

  /**
   * Add a new pipeline request instance.
   * @param {PipelineRequest} request The pipeline request instance.
   * @return {Promise}
   */
  add(request) {
    const pipelineName = `${request.name}.v${request.version}`;

    request.createSerial(pipelineName);
    request.createEventCallbackName('pipelineResponse');

    // Store the request.
    this.requests.set(pipelineName, {
      request,
      retries: request.retries,
      ongoing: 0,
      timer: null,
    });

    return this.dispatch(pipelineName);
  }

  /**
   * A little dummy callback.
   */
  dummyCallback = () => {}

  /**
   * Handles the request timeout.
   * @param {string} pipelineName The name of the pipeline.
   * @param {Function} reject Rejects the promise.
   */
  handleTimeout(pipelineName, reject) {
    const { request, retries } = this.requests.get(pipelineName);
    const callbackName = request.getEventCallbackName();

    setTimeout(() => {
      event.removeCallback(callbackName, request.callback);
      event.addCallback(callbackName, this.dummyCallback);

      if (!retries) {
        this.requests.delete(pipelineName);
        reject(new Error(`${request.name}.v${request.version} timed out after ${request.timeout}ms`));
        // TODO: Push to ErrorManager (consider request.handleErrors!!!)
        return;
      }

      this.decrementRetries(pipelineName);
      this.sendRequest(pipelineName);
    }, request.timeout);
  }

  /**
   * Creates the request callback.
   * @param {string} pipelineName The name of the pipeline request.
   * @param {Function} resolve Resolves the promise.
   * @param {Function} reject Rejects the promise.
   */
  createRequestCallback(pipelineName, resolve, reject) {
    const { request } = this.requests.get(pipelineName);
    const { input } = request;
    const callbackName = request.getEventCallbackName();

    request.callback = (error, serial, output) => {
      this.decrementOngoing(pipelineName);

      const isRetriesOngoing = this.isRetriesOngoing(pipelineName);
      const isProccessLastOngoing = this.isProccessLastOngoing(pipelineName);

      if (isRetriesOngoing || isProccessLastOngoing) {
        return;
      }

      event.removeCallback(callbackName, request.callback);

      logGroup(`PipelineResponse %c${pipelineName}`, {
        input,
        error,
        output,
        serial,
      }, '#307bc2');

      if (error) {
        this.requests.delete(pipelineName);
        reject(error);
        // TODO: Push to ErrorManager (consider request.handleErrors!!!)
        return;
      }

      this.requests.delete(pipelineName);
      resolve(output);
    };
  }

  /**
   * Dispatches the pipeline request.
   * @param {string} pipelineName The pipeline name.
   * @return {Promise}
   */
  dispatch(pipelineName) {
    return new Promise((resolve, reject) => {
      this.createRequestCallback(pipelineName, resolve, reject);
      this.handleTimeout(pipelineName, reject);
      this.sendRequest(pipelineName);
    });
  }

  /**
   * Sends the actual request command.
   * @param {string} pipelineName The name of the pipeline request.
   */
  sendRequest = (pipelineName) => {
    const entry = this.requests.get(pipelineName);

    if (!entry) {
      return;
    }

    const callbackName = entry.request.getEventCallbackName();
    const prefix = this.getRetriesPrefix(pipelineName);

    this.incrementOngoing(pipelineName);

    event.removeCallback(callbackName, this.dummyCallback);
    event.addCallback(callbackName, entry.request.callback);

    logGroup(`${prefix}PipelineRequest %c${pipelineName}`, {
      input: entry.request.input,
      serial: entry.request.serial,
    }, '#32ac5c');

    // Send the pipeline request.
    const command = new AppCommand();

    command
      .setCommandName('sendPipelineRequest')
      .setLibVersion('12.0')
      .dispatch({
        name: pipelineName,
        serial: entry.request.serial,
        input: entry.request.input,
        ...entry.request.trusted && { type: 'trusted' },
      });
  }

  /**
   * Increments the ongoing count.
   * @param {string} pipelineName The name of the pipeline request.
   */
  incrementOngoing = (pipelineName) => {
    const entry = this.requests.get(pipelineName);

    if (!entry) {
      return;
    }

    entry.ongoing += 1;
  }

  /**
   * Decrements the ongoing count.
   * @param {string} pipelineName The name of the pipeline request.
   */
  decrementOngoing = (pipelineName) => {
    const entry = this.requests.get(pipelineName);

    if (!entry) {
      return;
    }

    if (entry.ongoing) {
      entry.ongoing -= 1;
    }
  }

  /**
   * Decrements the retries count.
   * @param {string} pipelineName The name of the pipeline request.
   */
  decrementRetries = (pipelineName) => {
    const entry = this.requests.get(pipelineName);

    if (!entry) {
      return;
    }

    if (entry.retries) {
      entry.retries -= 1;
    }
  }

  /**
   * Returns the retries prefix for logs.
   * @param {string} pipelineName The name of the pipeline request.
   * @return {string}
   */
  getRetriesPrefix = (pipelineName) => {
    const { request, retries } = this.requests.get(pipelineName);
    const numRetries = request.retries - retries;

    return numRetries ? `Retry ${numRetries}: ` : '';
  }

  /**
   * Checks whether retries are ongoing.
   * @param {string} pipelineName The name of the pipeline request.
   * @return {boolean}
   */
  isRetriesOngoing = (pipelineName) => {
    const entry = this.requests.get(pipelineName);

    if (!entry) {
      return false;
    }

    return (
      entry.request.process === processTypes.PROCESS_ALWAYS &&
      entry.retries > 0 &&
      entry.ongoing > 0
    );
  }

  /**
   * Checks whether only the last should be processed..
   * @param {string} pipelineName The name of the pipeline request.
   * @return {boolean}
   */
  isProccessLastOngoing = (pipelineName) => {
    const entry = this.requests.get(pipelineName);

    if (!entry) {
      return false;
    }

    return (entry.request.process === processTypes.PROCESS_LAST && entry.ongoing);
  }
}

export default new PipelineManager();
