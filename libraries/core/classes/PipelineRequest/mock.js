const PipelineRequest = require.requireActual('./index').default;

/**
 * Mocked PipelineRequest.
 * Use it any time you need to mock a PipelineRequest.
 *
 * For more information and usage examples, please check the README.
 */
class MockedPipelineRequest extends PipelineRequest {
  /**
   * Getter for mockedDispatchResolver which is an additional helper function for custom, mock-only
   * `dispatch()` resolver.
   * @return {Function}
   */
  static get mockedDispatchResolver() {
    return () => {};
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
