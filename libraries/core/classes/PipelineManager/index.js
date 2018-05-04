import AppCommand from '../AppCommand';
import event from '../Event';
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
      ongoing: false,
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
    let { retries } = this.requests.get(pipelineName);
    const { request } = this.requests.get(pipelineName);
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

      retries -= 1;
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
      event.removeCallback(callbackName, request.callback);

      const entry = this.requests.get(pipelineName);
      const retry = request.retries - entry.retries;

      console.warn(`Retry: ${retry}`, entry);

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
    const { request } = this.requests.get(pipelineName);
    const callbackName = request.getEventCallbackName();

    event.removeCallback(callbackName, this.dummyCallback);
    event.addCallback(callbackName, request.callback);
    logGroup(`PipelineRequest %c${pipelineName}`, {
      input: request.input,
      serial: request.serial,
    }, '#32ac5c');

    // Send the pipeline request.
    const command = new AppCommand();
    command.setCommandName('sendPipelineRequest');
    command.setLibVersion('12.0');
    command.dispatch({
      name: pipelineName,
      serial: request.serial,
      input: request.input,
      ...request.trusted && { type: 'trusted' },
    });
  }
}

export default new PipelineManager();
