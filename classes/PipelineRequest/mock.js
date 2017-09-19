/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Mocked PipelineRequest.
 * Use it any time you need to mock a PipelineRequest.
 *
 * For more information and usage examples, please check the readme.
 */
class MockedPipelineRequest {
  /**
   * Getter for mockedDispatchResolver which is additional helper function for custom, mock-only
   * .dispatch resolver.
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
  }

  /**
   * Sets the payload for the MockedPipelineRequest
   * @param {Object} [mockedInput={}] The payload to send with the request.
   * @returns {MockedPipelineRequest}
   */
  setInput(mockedInput = {}) {
    this.input = mockedInput;
    return this;
  }

  /**
   * Returns promise and calls `MockedPipelineRequest.mockedDispatchResolver()` which
   * can be set up by using
   * .setMockedDispatchResolver.
   * @return {Promise}
   */
  dispatch() {
    return new Promise((resolve, reject) => {
      this.constructor.mockedDispatchResolver(this, resolve, reject);
    });
  }
}

/**
 * Factory which creates an instance of MockedPipelineRequest.
 * @param {Function} cb Resolver callback.
 * @return {MockedPipelineRequest}
 */
export const mockedPipelineRequestFactory = cb =>
  class extends MockedPipelineRequest {
    /**
     * Getter for custom mocked resolver.
     * @return {Function}
     */
    static get mockedDispatchResolver() {
      return cb;
    }
  };

