import AppCommand from '../AppCommand';
import event from '../Event';
import errorManager from '../ErrorManager';
import pipelineDependencies from '../PipelineDependencies';
import pipelineSequence from '../PipelineSequence';
import * as errorSources from '../ErrorManager/constants';
import * as errorHandleTypes from '../../constants/ErrorHandleTypes';
import * as processTypes from '../../constants/ProcessTypes';
import { ETIMEOUT } from '../../constants/Pipeline';
import logGroup from '../../helpers/logGroup';

/**
 * The PipelineManager class.
 * Manages requests, retries responses and timeouts of PipelineRequest instances.
 */
class PipelineManager {
  /**
   * Constructor.
   */
  constructor() {
    // The open requests at any given time.
    this.requests = new Map();

    // The pipelines which have currently running requests.
    this.pipelines = new Map();

    // The error codes that should be suppressed.
    this.suppressedErrors = [];
  }

  /**
   * Adds error code(s) to the suppressed collection.
   * @param {Array|string} code The code(s) of the errors to suppress.
   */
  addSuppressedErrors(code) {
    const codes = [].concat(code);

    this.suppressedErrors = [
      ...this.suppressedErrors,
      ...codes,
    ];
  }

  /**
   * Adds a new PipelineRequest instance.
   * @param {PipelineRequest} request The pipeline request instance.
   * @return {Promise}
   */
  add(request) {
    request.createSerial(`${request.name}.v${request.version}`);
    request.createEventCallbackName('pipelineResponse');

    // Store the request by serial to be accessible later.
    this.requests.set(request.serial, {
      request,
      retries: request.retries,
      finished: false,
      deferred: false,
      timer: null,
    });

    return this.dispatch(request.serial);
  }

  /**
   * Dispatches a PipelineRequest instance.
   * @param {string} serial The pipeline request serial.
   * @return {Promise}
   */
  dispatch(serial) {
    return new Promise((resolve, reject) => {
      const entry = this.requests.get(serial);
      const { name } = entry.request;

      this.createRequestCallback(serial, resolve, reject);

      if (this.hasRunningDependencies(name)) {
        // Requests with running dependencies will be sent after the dependencies are finished.
        entry.deferred = true;
        return;
      }

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
    const entry = this.requests.get(serial);
    const { request } = entry;

    // Add the executor functions to the request object.
    request.resolve = resolve;
    request.reject = reject;

    /**
     * A callback that is invoked when a pipeline response comes in.
     * @param {Object} error A pipeline error object.
     * @param {string} serialResult A pipeline serial.
     * @param {Object} output The pipeline response payload.
     */
    const callback = (error, serialResult, output) => {
      // Add the relevant response properties to the request object.
      request.error = error;
      request.output = output;

      entry.finished = true;

      if (request.process === processTypes.PROCESS_SEQUENTIAL) {
        this.handleResultSequence();
        return;
      }

      this.handleResult(serialResult);
    };

    // Take care that the callback always has the correct context.
    request.callback = callback.bind(this);

    const callbackName = request.getEventCallbackName();

    // Register a response listener for the request.
    event.addCallback(callbackName, request.callback);
  }

  /**
   * Checks wether a pipeline request has running dependencies.
   * @param {string} pipelineName The name of the pipeline.
   * @return {boolean}
   */
  hasRunningDependencies(pipelineName) {
    const dependencies = pipelineDependencies.get(pipelineName);
    let found = 0;

    dependencies.forEach((dependency) => {
      // Check if the dependency exists and is ongoing.
      if (this.pipelines.has(dependency) && this.pipelines.get(dependency) > 0) {
        found += 1;
      }
    });

    return found > 0;
  }

  /**
   * Sends deferred requests when they dont' have running dependencies anymore.
   */
  handleDeferredRequests() {
    this.requests.forEach((entry) => {
      const { deferred, request: { name, serial } } = entry;
      // Stop processing When the current request isn't deferred, or still has running dependencies.
      if (!deferred || this.hasRunningDependencies(name)) {
        return;
      }

      // eslint-disable-next-line no-param-reassign
      entry.deferred = false;
      this.sendRequest(serial);
    });
  }

  /**
   * Handles the request timeout.
   * @param {string} serial The pipeline request serial.
   */
  handleTimeout(serial) {
    const entry = this.requests.get(serial);
    const { request, retries } = entry;

    entry.timer = setTimeout(() => {
      if (!retries) {
        const error = {
          message: `Pipeline '${request.name}.v${request.version}' timed out after ${request.timeout}ms`,
          code: ETIMEOUT,
        };

        // Invoke the request callback with the timeout error.
        request.callback(error, serial);
        return;
      }

      this.decrementRetries(serial);
      this.sendRequest(serial);
    }, request.timeout);
  }

  /**
   * Handles a pipeline error.
   * @param {string} serial The pipeline request serial.
   */
  handleError(serial) {
    const { request } = this.requests.get(serial);
    const pipelineName = this.getPipelineNameBySerial(serial);

    const { code, message } = request.error || {};

    const err = new Error(message);
    err.code = code;

    request.reject(err);

    // Stop if this error code was set to be suppressed.
    if (this.suppressedErrors.includes(code)) {
      return;
    }

    // Stop if this PipelineRequest was configured to ignore this specific error code.
    if (request.errorBlacklist.includes(code)) {
      return;
    }

    if (request.handleErrors === errorHandleTypes.ERROR_HANDLE_DEFAULT) {
      errorManager.queue({
        source: errorSources.SOURCE_PIPELINE,
        context: pipelineName,
        meta: {
          input: request.input,
        },
        code,
        message,
      });
    }
  }

  /**
   * Handles the result of a dispatched PipelineRequest.
   * @param {string} serial The pipeline request serial.
   */
  handleResult(serial) {
    const entry = this.requests.get(serial);
    const { request } = entry;
    const { input, error, output } = request;
    const pipelineName = this.getPipelineNameBySerial(serial);
    const callbackName = request.getEventCallbackName();

    this.decrementPipelineOngoing(serial);

    let logColor = '#307bc2';

    if (request.error) {
      logColor = '#ff0000';
      this.handleError(serial);
    } else {
      request.resolve(request.output);
    }

    logGroup(`PipelineResponse %c${pipelineName}`, {
      input,
      error,
      output,
      serial,
    }, logColor);

    // Cleanup.
    event.removeCallback(callbackName, request.callback);
    clearTimeout(entry.timer);
    this.removeRequestFromPiplineSequence(serial);
    this.requests.delete(serial);

    // Take care about requests that where deferred since depencensies where running.
    this.handleDeferredRequests();
  }

  /**
   * Handles the results sequentially.
   */
  handleResultSequence() {
    // Create a copy of the sequence, to avoid side effects when entries are removed.
    const [...sequence] = pipelineSequence.get();

    for (let i = 0; i < sequence.length; i += 1) {
      const serial = sequence[i];
      const entry = this.requests.get(serial);

      if (!entry) {
        // Remove sequence entries without request.
        this.removeRequestFromPiplineSequence(serial);
      } else if (!entry.finished) {
        // Stop sequence procession at the first not finished request.
        break;
      } else {
        this.handleResult(serial);
      }
    }
  }

  /**
   * Sends the actual request command.
   * @param {string} serial The pipeline request serial.
   */
  sendRequest(serial) {
    const entry = this.requests.get(serial);

    if (!entry) {
      return;
    }

    this.incrementPipelineOngoing(serial);
    this.handleTimeout(serial);
    this.addRequestToPipelineSequence(serial);

    const prefix = this.getRetriesPrefix(serial);
    const pipelineName = this.getPipelineNameBySerial(serial);

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
   * Adds sequentially processed requests to the pipeline sequence.
   * @param {string} serial The pipeline request serial.
   */
  addRequestToPipelineSequence(serial) {
    const { request } = this.requests.get(serial);

    if (request.process === processTypes.PROCESS_SEQUENTIAL) {
      pipelineSequence.set(serial);
    }
  }

  /**
   * Removes sequentially processed requests from the pipeline sequence.
   * @param {string} serial The pipeline request serial.
   */
  removeRequestFromPiplineSequence(serial) {
    const { request } = this.requests.get(serial) || {};

    if (request && request.process === processTypes.PROCESS_SEQUENTIAL) {
      pipelineSequence.remove(request.serial);
    } else if (!request) {
      pipelineSequence.remove(serial);
    }
  }

  /**
   * Increments the ongoing count for the pipeline of a request.
   * @param {string} serial The pipeline request serial.
   */
  incrementPipelineOngoing(serial) {
    const pipelineName = this.getPipelineNameBySerial(serial, false);

    if (!pipelineName) {
      return;
    }

    if (!this.pipelines.has(pipelineName)) {
      this.pipelines.set(pipelineName, 1);
    } else {
      this.pipelines.set(pipelineName, this.pipelines.get(pipelineName) + 1);
    }
  }

  /**
   * Decrements the ongoing count for the pipeline of a request.
   * @param {string} serial The pipeline request serial.
   */
  decrementPipelineOngoing(serial) {
    const pipelineName = this.getPipelineNameBySerial(serial, false);

    if (!pipelineName) {
      return;
    }

    if (this.pipelines.has(pipelineName)) {
      const ongoing = this.pipelines.get(pipelineName);

      if (ongoing > 1) {
        this.pipelines.set(pipelineName, ongoing - 1);
      } else {
        this.pipelines.delete(pipelineName);
      }
    }
  }

  /**
   * Decrements the retries count.
   * @param {string} serial The pipeline request serial.
   */
  decrementRetries(serial) {
    const entry = this.requests.get(serial);

    if (!entry) {
      return;
    }

    if (entry.retries) {
      entry.retries -= 1;
    }
  }

  /**
   * Returns the PipelineRequest name.
   * @param {string} serial The pipeline request serial.
   * @param {boolean} [addVersion=true] Should the pipeline version be added.
   * @return {string}
   */
  getPipelineNameBySerial(serial, addVersion = true) {
    const entry = this.requests.get(serial);

    if (!entry) {
      return '';
    }

    if (addVersion) {
      return `${entry.request.name}.v${entry.request.version}`;
    }

    return entry.request.name;
  }

  /**
   * Returns the retries prefix for logs.
   * @param {string} serial The pipeline request serial.
   * @return {string}
   */
  getRetriesPrefix(serial) {
    const { request, retries } = this.requests.get(serial);
    const numRetries = request.retries - retries;

    return numRetries ? `Retry ${numRetries}: ` : '';
  }
}

export default new PipelineManager();
