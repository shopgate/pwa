/**
 * Copyright (c) 2018, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  REQUEST_PAGE_CONFIG,
  RECEIVE_PAGE_CONFIG,
  ERROR_PAGE_CONFIG,
} from '../../constants/ActionTypes';

import {
  requestPageConfig,
  receivePageConfig,
  errorPageConfig,
} from './index';

const pageId = 'index';
const config = { some: 'data' };

describe('ActionCreators: modal', () => {
  describe('requestPageConfig()', () => {
    it('should work as expected', () => {
      const expected = {
        type: REQUEST_PAGE_CONFIG,
        pageId,
      };
      expect(requestPageConfig(pageId)).toEqual(expected);
    });
  });

  describe('receivePageConfig()', () => {
    it('should work as expected', () => {
      const expected = {
        type: RECEIVE_PAGE_CONFIG,
        pageId,
        config,
      };
      expect(receivePageConfig(pageId, config)).toEqual(expected);
    });
  });

  describe('errorPageConfig()', () => {
    it('should work as expected', () => {
      const expected = {
        type: ERROR_PAGE_CONFIG,
        pageId,
      };
      expect(errorPageConfig(pageId)).toEqual(expected);
    });
  });
});
