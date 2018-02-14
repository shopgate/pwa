/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import pipelineErrorDialog from './pipelineErrorDialog';

describe('Dialog actions', () => {
  describe('pipelineErrorDialog', () => {
    /**
     * Tests the error dispatching.
     * @param {string} name Pipeline name.
     * @param {string} expectedMessage Expected message.
     */
    const testDispatch = ({ name, expectedMessage = 'Example error' }) => {
      const error = new Error('Example error');
      const action = {
        name,
        input: {},
        error,
      };
      const mockedDispatch = jest.fn();
      const mockedModalDispatch = jest.fn();
      pipelineErrorDialog(action)(mockedDispatch);
      mockedDispatch.mock.calls[0][0](mockedModalDispatch);
      const result = mockedModalDispatch.mock.calls[0][0];
      expect(typeof result).toBe('object');
      expect(typeof result.options).toBe('object');
      expect(result.options.message).toBe(expectedMessage);
    };
    it('should show generic modal', () => {
      testDispatch({ name: 'default' });
    });
    it('should show cannot add favorites', () => {
      testDispatch({
        name: 'addFavorites_v1',
        expectedMessage: 'favorites.error_add',
      });
    });
    it('should show cannot remove favorites', () => {
      testDispatch({
        name: 'deleteFavorites_v1',
        expectedMessage: 'favorites.error_remove',
      });
    });
  });
});
