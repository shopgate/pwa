import { logger } from '../../helpers';
import * as errorHandleTypes from '../../constants/ErrorHandleTypes';
import * as processTypes from '../../constants/ProcessTypes';

/**
 * Mocked PipelineRequest.
 * Use it any time you need to mock a PipelineRequest.
 *
 * For more information and usage examples, please check the README.
 */
class MockedPipelineRequest {
  /**
   * Getter for mockedDispatchResolver which is an additional helper function for custom, mock-only
   * `dispatch()` resolver.
   * @return {Function}
   */
  static get mockedDispatchResolver() {
    return () => {};
  }

  /**
   * Initializes the MockedPipelineRequest object.
   * @param {string} name The pipeline name.
   */
  constructor(name) {
    this.name = name;
    this.input = {};
    this.handleErrors = errorHandleTypes.ERROR_HANDLE_DEFAULT;
    this.errorBlacklist = [];
    this.process = processTypes.DEFAULT_PROCESSED;
  }

  /**
   * Sets the payload for the MockedPipelineRequest.
   * @param {Object} [mockedInput={}] The payload to send with the request.
   * @returns {MockedPipelineRequest}
   */
  setInput(mockedInput = {}) {
    this.input = mockedInput;
    return this;
  }

  /**
   * @param {number} retries The number of retries this pipeline request should perform.
   * @return {PipelineRequest}
   */
  setRetries(retries = 3) {
    if (typeof retries !== 'number') throw new TypeError(`Expected 'number'. Received: '${typeof retries}'`);
    if (retries < 0) throw new Error(`Expected positive integer. Received: '${retries}'`);
    if (retries >= 5) throw new Error(`Max retries exceeded. Received: '${retries}'`);

    this.retries = Math.min(retries, 5);
    return this;
  }

  /**
   * Returns promise and calls `MockedPipelineRequest.mockedDispatchResolver()`.
   * @returns {Promise}
   */
  dispatch() {
    return new Promise((resolve, reject) => {
      this.constructor.mockedDispatchResolver(this, resolve, reject);
    });
  }

  /**
   * @param {string} processed The response process type.
   * @return {PipelineRequest}
   */
  setResponseProcessed(processed = processTypes.DEFAULT_PROCESSED) {
    if (typeof processed !== 'string') throw new TypeError(`Expected 'string'. Received: '${typeof processed}'`);
    if (!Object.values(processTypes).includes(processed)) {
      throw new Error(`The value '${processed}' is not supported!`);
    }

    this.process = processed;
    return this;
  }

  /**
   * Sets a blacklist of error codes that should not be handled internally.
   * Can be used for custom error handling outside.
   * @param {Object} errors - Array of error codes
   * @return {PipelineRequest}
   */
  setErrorBlacklist(errors = []) {
    this.errorBlacklist = errors;
    return this;
  }

  /**
   * @param {string} handle The handle errors type.
   * @return {PipelineRequest}
   */
  setHandleErrors(handle = errorHandleTypes.ERROR_HANDLE_DEFAULT) {
    if (typeof handle !== 'string') throw new TypeError(`Expected 'string'. Received: '${typeof handle}'`);
    if (!Object.values(errorHandleTypes).includes(handle)) {
      throw new Error(`The value '${handle}' is not supported!`);
    }

    this.handleErrors = handle;
    return this;
  }

  /**
   * Sets handled errors.
   * @param {Array} errors Blacklisted errors.
   * @returns {MockedPipelineRequest}
   * @deprecated
   */
  setHandledErrors(errors = []) {
    logger.warn('Deprecated: setHandledErrors() will be removed in favor of setErrorBlacklist()!');

    this.setErrorBlacklist(errors);
    return this;
  }

  /**
   * Sets a flag to suppress errors.
   * When true, no EVENT_PIPELINE_ERROR would be triggered.
   * @param {bool} value Value.
   * @return {PipelineRequest}
   * @deprecated
   */
  setSuppressErrors(value) {
    logger.warn('Deprecated: setSuppressErrors() will be removed. Use setHandleErrors() instead!');
    const handle = value ?
      errorHandleTypes.ERROR_HANDLE_SUPPRESS : errorHandleTypes.ERROR_HANDLE_DEFAULT;
    this.setHandleErrors(handle);
    return this;
  }
}

/**
 * Factory which creates an instance of MockedPipelineRequest.
 * @param {Function} callback Resolver callback.
 * @returns {MockedPipelineRequest}
 */
export const mockedPipelineRequestFactory = callback =>
  class extends MockedPipelineRequest {
    /**
     * Getter for custom mocked resolver.
     * @return {Function}
     */
    static get mockedDispatchResolver() {
      return callback;
    }
  };
