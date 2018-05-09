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
    this.handledErrors = [];
    this.suppressErrors = false;
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
   * Returns promise and calls `MockedPipelineRequest.mockedDispatchResolver()`.
   * @returns {Promise}
   */
  dispatch() {
    return new Promise((resolve, reject) => {
      this.constructor.mockedDispatchResolver(this, resolve, reject);
    });
  }

  /**
   * Sets handled errors.
   * @param {Array} errors Handled errors.
   * @returns {MockedPipelineRequest}
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
