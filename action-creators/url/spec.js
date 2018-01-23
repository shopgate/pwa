/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  RECEIVE_URL,
  REQUEST_URL,
  ERROR_URL,
} from '../../constants/ActionTypes';

import {
  receiveUrl,
  requestUrl,
  errorUrl,
} from './index';

const url = 'https://www.myshop.com/checkout';
const urlType = 'checkout';
const expires = 123456;

describe('Action Creators: url', () => {
  describe('receiveUrl()', () => {
    it('should work as expected', () => {
      const expected = {
        type: RECEIVE_URL,
        url,
        urlType,
        expires,
      };
      expect(receiveUrl(urlType, url, expires)).toEqual(expected);
    });

    it('should work as expected when no expires parameter is passed', () => {
      const expected = {
        type: RECEIVE_URL,
        url,
        urlType,
        expires: null,
      };
      expect(receiveUrl(urlType, url)).toEqual(expected);
    });
  });

  describe('requestUrl()', () => {
    it('should work as expected', () => {
      const expected = {
        type: REQUEST_URL,
        urlType,
      };
      expect(requestUrl(urlType)).toEqual(expected);
    });
  });

  describe('errorUrl()', () => {
    it('should work as expected', () => {
      const expected = {
        type: ERROR_URL,
        urlType,
      };
      expect(errorUrl(urlType)).toEqual(expected);
    });
  });
});
