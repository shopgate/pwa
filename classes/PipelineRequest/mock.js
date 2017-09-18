/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
/**
 * Mocked PipelineRequest.
 * Use it any time you need to mock a PipelineQuest.
 *
 * Usage:
 * For a test usually you need to have control over how the dispatch resolves.
 * For this purpose, use .setMockedDispatchResolver to set up a callback which will be called
 * after PipelineRequest.dispatch is called instead of the original one.
 *
 * To make it work, you can mock the original PipelineRequest by using jest.mock
 * after your test import statements. For example:
 * jest.mock(
 *  '@shopgate/pwa-core/classes/PipelineRequest',
 *  () => (
 *    mockedPipelineRequestFactory((mockInstance, resolve, reject) => {
 *      // This is a callback which will be executed in .dispatch.
 *    })
 *  )
 * );
 */
class MockedPipelineRequest {
  /**
   * Getter for mockedDispatchResolver which is additional helper function for custom, mock-only
   * .dispatch resolver.
   * @return {function()}
   */
  static get mockedDispatchResolver() {
    return () => {};
  }

  /**
   * @inheritDoc
   */
  constructor(name) {
    this.name = name;
    this.input = {};
  }

  /**
   * @inheritDoc {PipelineRequest}
   */
  setInput(mockedInput = {}) {
    this.input = mockedInput;
    return this;
  }

  /**
   * Returns promise and calls .mockedDispatchResolver which can be set up by using
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
 *
 * @param {function} cb Resolver callback.
 * @return {MockedPipelineRequest}
 */
export const mockedPipelineRequestFactory = cb =>
  class extends MockedPipelineRequest {
    /**
     * Getter for custom mocked resolver.
     * @return {*}
     */
    static get mockedDispatchResolver() {
      return cb;
    }
  };

