import AppCommand from '../AppCommand';
import event from '../Event';
import errorManager from '../ErrorManager';
import pipelineDependencies from '../PipelineDependencies';
import pipelineBuffer from '../PipelineBuffer';
import pipelineSequence from '../PipelineSequence';
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
    const codes = [].concat(code);

    this.suppressedErrors = [
      ...this.suppressedErrors,
      ...codes,
    ];
  }

  /**
   * Dispatches the pipeline request.
   * @param {string} serial The pipeline request serial.
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
   * @param {string} serial The pipeline request serial.
   * @param {Function} resolve Resolves the promise.
   * @param {Function} reject Rejects the promise.
   */
  createRequestCallback(serial, resolve, reject) {
    const { request } = this.requests.get(serial);

    request.callback = (error, serialResult, output) => {
      request.error = error;
      request.output = output;
      request.resolve = resolve;
      request.reject = reject;

      if (request.process === processTypes.PROCESS_SEQUENTIAL) {
        this.handleResultSequence(serial);
      } else {
        this.handleResult(serial);
      }
    };
  }

  /**
   * Checks wether a pipeline request has running dependencies.
   * @param {string} serial The pipeline request serial.
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
   * Handles the request timeout.
   * @param {string} serial The pipeline request serial.
   */
  handleTimeout(serial) {
    const { request, retries } = this.requests.get(serial);
    const callbackName = request.getEventCallbackName();

    setTimeout(() => {
      event.removeCallback(callbackName, request.callback);
      event.addCallback(callbackName, this.dummyCallback);

      if (!retries) {
        const message = `Pipeline '${request.name}.v${request.version}' timed out after ${request.timeout}ms`;
        this.handleError(serial, message);
        this.requests.delete(serial);
        return;
      }

      this.decrementRetries(serial);
      this.sendRequest(serial);
    }, request.timeout);
  }

  /**
   * Runs a pipeline request's dependencies.
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
   * @param {string} serial The pipeline request serial.
   * @param {string} [message=null] A custom error message.
   */
  handleError = (serial, message = null) => {
    const { request } = this.requests.get(serial);
    const pipelineName = this.getPipelineNameBySerial(serial);

    if (this.suppressedErrors.includes(request.error.code)) return;

    if (request.handleErrors === errorHandleTypes.ERROR_HANDLE_DEFAULT) {
      errorManager.queue({
        source: errorSources.SOURCE_PIPELINE,
        code: message ? 'ETIMEOUT' : request.error.code,
        context: pipelineName,
        message: message || request.error.message,
      });
    }

    request.reject(new Error(request.error.message));
  }

  /**
   * Handles the result of a pipeline request.
   * @param {string} serial The pipeline request serial.
   */
  handleResult = (serial) => {
    const { request } = this.requests.get(serial);
    const { input, error, output } = request;
    const pipelineName = this.getPipelineNameBySerial(serial);
    const callbackName = request.getEventCallbackName();

    this.decrementOngoing(serial);
    this.runDependencies(pipelineName);

    const isRetriesOngoing = this.isRetriesOngoing(serial);
    const isProcessLastOngoing = this.isProcessLastOngoing(serial);

    if (isRetriesOngoing || isProcessLastOngoing) {
      return;
    }

    pipelineSequence.remove(serial);
    event.removeCallback(callbackName, request.callback);

    if (request.error) {
      this.handleError(serial);
    } else {
      logGroup(`PipelineResponse %c${pipelineName}`, {
        input,
        error,
        output,
        serial,
      }, '#307bc2');
      request.resolve(request.output);
    }

    this.requests.delete(serial);
  }

  /**
   * Handles the results sequentially.
   * @param {string} serial The pipeline request serial.
   */
  handleResultSequence = (serial) => {
    const sequence = pipelineSequence.get();

    /* eslint-disable no-restricted-syntax */
    for (const ser of sequence) {
      const entry = this.requests.get(ser);

      if (serial === ser || entry.output) {
        this.handleResult(ser);
        return;
      }

      break;
    }
    /* eslint-enable no-restricted-syntax */
  }

  /**
   * Sends the actual request command.
   * @param {string} serial The pipeline request serial.
   */
  sendRequest = (serial) => {
    const entry = this.requests.get(serial);

    if (!entry) {
      return;
    }

    if (entry.request.process === processTypes.PROCESS_SEQUENTIAL) {
      pipelineSequence.set(serial);
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
   * @param {string} serial The pipeline request serial.
   */
  incrementOngoing = (serial) => {
    const entry = this.requests.get(serial);

    if (!entry) {
      return;
    }

    entry.ongoing += 1;
  }

  /**
   * Decrements the ongoing count.
   * @param {string} serial The pipeline request serial.
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
   * @param {string} serial The pipeline request serial.
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
   * Returns the pipeline request name.
   * @param {string} serial The pipeline request serial.
   * @return {string}
   */
  getPipelineNameBySerial = (serial) => {
    const entry = this.requests.get(serial);

    if (!entry) return '';
    return `${entry.request.name}.v${entry.request.version}`;
  }

  /**
   * Returns the retries prefix for logs.
   * @param {string} serial The pipeline request serial.
   * @return {string}
   */
  getRetriesPrefix = (serial) => {
    const { request, retries } = this.requests.get(serial);
    const numRetries = request.retries - retries;

    return numRetries ? `Retry ${numRetries}: ` : '';
  }

  /**
   * Checks whether retries are ongoing.
   * @param {string} serial The pipeline request serial.
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
   * @param {string} serial The pipeline request serial.
   * @return {boolean}
   */
  isProcessLastOngoing = (serial) => {
    const entry = this.requests.get(serial);

    if (!entry) {
      return false;
    }

    return (entry.request.process === processTypes.PROCESS_LAST && entry.ongoing);
  }
}

export default new PipelineManager();
