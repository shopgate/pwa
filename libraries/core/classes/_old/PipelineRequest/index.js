import { logger } from '../../helpers';
import logGroup from '../../helpers/logGroup';
import event from '../Event';
import AppCommand from '../AppCommand';
import Request from '../Request';
import requestBuffer from '../RequestBuffer';
import { getPipelineManager } from '../PipelineManagers';
import {
  CURRENT_VERSION,
  EVENT_PIPELINE_ERROR,
  ETIMEOUT,
  TYPE_TRUSTED,
} from '../../constants/Pipeline';

/**
 * The pipeline request class.
 * It sends a pipeline request and returns a promise.
 */
class PipelineRequest extends Request {
  /**
   * Initializes the PipelineRequest object.
   * @param {string} name The pipeline name.
   * @param {number} [version=CURRENT_VERSION] The pipeline version.
   */
  constructor(name, version = CURRENT_VERSION) {
    super(getPipelineManager(name));

    this.name = `${name}.v${version}`;
    this.input = {};
    this.handledErrors = [];
    this.suppressErrors = false;
    this.createSerial(this.name);
    this.createEventCallbackName('pipelineResponse');
    this.requestCallback = null;
  }

  /**
   * Sets the payload for the PipelineRequest
   * @param {Object} [input={}] The payload to send with the request.
   * @returns {PipelineRequest}
   */
  setInput(input = {}) {
    this.input = input;
    return this;
  }

  /**
   * Sets the type of the request to TYPE_TRUSTED
   * @returns {PipelineRequest}
   */
  setTrusted() {
    this.type = TYPE_TRUSTED;
    return this;
  }

  /**
   * Sets a list of error codes which will be handled within the reject callback of the promise.
   * @param {Array} errors The error codes
   * @return {PipelineRequest}
   */
  setHandledErrors(errors = []) {
    this.handledErrors = errors;
    return this;
  }

  /**
   * Sets a flag to suppress errors.
   * When true, no EVENT_PIPELINE_ERROR would be triggered.
   * @param {bool} value Value.
   * @return {PipelineRequest}
   */
  setSuppressErrors(value) {
    this.suppressErrors = value;
    return this;
  }

  /**
   * Sends the pipeline request.
   * @param {function} resolve The resolve() callback of the request promise.
   * @param {function} reject The reject() callback of the request promise.
   */
  onDispatch(resolve, reject) {
    const requestCallbackName = this.getEventCallbackName();

    /**
     * The request event callback for the response call.
     * @param {Object|null} error The error object if an error happened.
     * @param {string} serial The serial that was used to identify the PipelineRequest callback.
     * @param {Object} output The output of the pipeline.
     */
    this.requestCallback = (error, serial, output) => {
      event.removeCallback(requestCallbackName, this.requestCallback);
      requestBuffer.remove(serial);

      const { input, name } = this;

      logGroup(`PipelineResponse %c${this.name}`, {
        input,
        error,
        output,
      }, '#307bc2');

      if (error) {
        const isHandledError = this.handledErrors.includes(error.code);
        if (!this.suppressErrors && !isHandledError) {
          event.trigger(EVENT_PIPELINE_ERROR, {
            name,
            input,
            error,
          });
        }

        this.manager.handleError(this, reject, error);
        return;
      }

      this.manager.handleResponse(this, resolve, output);
    };

    // Apply the event callback.
    event.addCallback(requestCallbackName, this.requestCallback);

    logGroup(`PipelineRequest %c${this.name}`, { input: this.input }, '#32ac5c');

    // Send the pipeline request.
    const command = new AppCommand();
    command.setCommandName('sendPipelineRequest');
    command.setLibVersion('12.0');
    command.dispatch({
      name: this.name,
      serial: this.serial,
      input: this.input,
      ...this.type && { type: this.type },
    });
  }

  /**
   * On timeout log error.
   */
  onTimeout() {
    const subject = `pipelineRequest: ${this.name}`;
    const message = `Timeout (${this.manager.timeout / 1000}s) reached`;
    const error = {
      code: ETIMEOUT,
      message,
    };

    this.requestCallback(error, this.serial, {});
    this.manager.handleError(this, () => {}, message);

    logger.log(subject, {
      input: this.input,
      error,
      message,
    });
  }
}

export default PipelineRequest;
