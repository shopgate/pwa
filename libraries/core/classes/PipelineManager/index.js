import AppCommand from '../AppCommand';
import event from '../Event';
import errorManager from '../ErrorManager';
import pipelineDependencies from '../PipelineDependencies';
import pipelineBuffer from '../PipelineBuffer';
import * as errorSources from '../ErrorManager/constants';
import * as errorHandleTypes from '../../constants/ErrorHandleTypes';
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
    this.suppressedErrors = [];
  }

  /**
   * Add a new pipeline request instance.
   * @param {PipelineRequest} request The pipeline request instance.
   * @return {Promise}
   */
  add(request) {
    request.createSerial(`${request.name}.v${request.version}`);
    request.createEventCallbackName('pipelineResponse');

    // Store the request.
    this.requests.set(request.serial, {
      request,
      retries: request.retries,
      ongoing: 0,
      timer: null,
    });

    return this.dispatch(request.serial);
  }

  /**
   * Adds error code(s) to the suppressed collection.
   * @param {Array|string} code The code(s) to suppress errors for.
   */
  addSuppressedErrors(code) {
    if (Array.isArray(code)) {
      this.suppressedErrors = [
        ...this.suppressedErrors,
        ...code,
      ];
    } else {
      this.suppressedErrors.push(code);
    }
  }

  /**
   * Dispatches the pipeline request.
   * @param {string} pipelineName The pipeline name.
   * @return {Promise}
   */
  dispatch(serial) {
    return new Promise((resolve, reject) => {
      if (this.hasRunningDependencies(serial)) {
        return;
      }

      this.createRequestCallback(serial, resolve, reject);
      this.handleTimeout(serial, reject);
      this.sendRequest(serial);
    });
  }

  /**
   * Creates the request callback.
   * @param {string} pipelineName The name of the pipeline request.
   * @param {Function} resolve Resolves the promise.
   * @param {Function} reject Rejects the promise.
   */
  createRequestCallback(serial, resolve, reject) {
    const { request } = this.requests.get(serial);
    const { input } = request;
    const callbackName = request.getEventCallbackName();
    const pipelineName = this.getPipelineNameBySerial(serial);

    request.callback = (error, serialResult, output) => {
      this.decrementOngoing(serial);
      this.runDependencies(pipelineName);

      const isRetriesOngoing = this.isRetriesOngoing(serial);
      const isProccessLastOngoing = this.isProccessLastOngoing(serial);

      if (isRetriesOngoing || isProccessLastOngoing) {
        return;
      }

      event.removeCallback(callbackName, request.callback);

      if (error) {
        this.handleError(error.message, pipelineName, reject, error.code);
      } else {
        logGroup(`PipelineResponse %c${pipelineName}`, {
          input,
          error,
          output,
          serial,
        }, '#307bc2');
        resolve(output);
      }

      this.requests.delete(serial);
    };
  }

  /**
   *
   * @param {string} pipelineName The pipeline name.
   * @return {boolean}
   */
  hasRunningDependencies(serial) {
    const pipelineName = this.getPipelineNameBySerial(serial);
    const dependencies = pipelineDependencies.get(pipelineName);
    let found = 0;

    if (!dependencies || !dependencies.length) return false;

    dependencies.forEach((dependency) => {
      if (this.requests.has(dependency) && this.requests.get(dependency).ongoing) {
        found += 1;
        pipelineBuffer.set(dependency, pipelineName);
      }
    });

    if (!found) return false;
    return true;
  }

  /**
   * @param {string} pipelineName The pipeline request name.
   */
  runDependencies = (pipelineName) => {
    pipelineBuffer
      .get(pipelineName)
      .forEach((dependency) => {
        this.dispatch(dependency);
      });
  }

  /**
   * A little dummy callback.
   */
  dummyCallback = () => {}

  /**
   * Handles a pipeline error.
   * @param {string} message The actual error message.
   * @param {string} pipelineName The name of the pipeline request.
   * @param {Function} reject Rejects the promise.
   * @param {string} code The error code.
   */
  handleError = (message, serial, reject, code = 'ETIMEOUT') => {
    if (this.suppressedErrors.includes(code)) return;

    const { request } = this.requests.get(serial);
    const pipelineName = this.getPipelineNameBySerial(serial);

    if (request.handleErrors === errorHandleTypes.ERROR_HANDLE_DEFAULT) {
      errorManager.queue({
        source: errorSources.SOURCE_PIPELINE,
        code,
        context: pipelineName,
        message,
      });
    }

    reject(new Error(message));
  }

  /**
   * Handles the request timeout.
   * @param {string} pipelineName The name of the pipeline.
   * @param {Function} reject Rejects the promise.
   */
  handleTimeout(serial, reject) {
    const { request, retries } = this.requests.get(serial);
    const callbackName = request.getEventCallbackName();

    setTimeout(() => {
      event.removeCallback(callbackName, request.callback);
      event.addCallback(callbackName, this.dummyCallback);

      if (!retries) {
        const message = `Pipeline '${request.name}.v${request.version}' timed out after ${request.timeout}ms`;
        this.handleError(message, serial, reject);
        this.requests.delete(serial);
        return;
      }

      this.decrementRetries(serial);
      this.sendRequest(serial);
    }, request.timeout);
  }

  /**
   * Sends the actual request command.
   * @param {string} pipelineName The name of the pipeline request.
   */
  sendRequest = (serial) => {
    const entry = this.requests.get(serial);

    if (!entry) {
      return;
    }

    const callbackName = entry.request.getEventCallbackName();
    const prefix = this.getRetriesPrefix(serial);
    const pipelineName = this.getPipelineNameBySerial(serial);

    this.incrementOngoing(serial);

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
  decrementOngoing = (serial) => {
    const entry = this.requests.get(serial);

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
  decrementRetries = (serial) => {
    const entry = this.requests.get(serial);

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
  getRetriesPrefix = (serial) => {
    const { request, retries } = this.requests.get(serial);
    const numRetries = request.retries - retries;

    return numRetries ? `Retry ${numRetries}: ` : '';
  }

  /**
   * Checks whether retries are ongoing.
   * @param {string} pipelineName The name of the pipeline request.
   * @return {boolean}
   */
  isRetriesOngoing = (serial) => {
    const entry = this.requests.get(serial);

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
  isProccessLastOngoing = (serial) => {
    const entry = this.requests.get(serial);

    if (!entry) {
      return false;
    }

    return (entry.request.process === processTypes.PROCESS_LAST && entry.ongoing);
  }

  getPipelineNameBySerial = (serial) => {
    const entry = this.requests.get(serial);

    if (!entry) return '';

    return `${entry.request.name}.v${entry.request.version}`;
  }
}

export default new PipelineManager();
