/**
 * Copyright (c) 2018, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  setLoading,
  unsetLoading,
  incrementLoading,
  decrementLoading,
} from './index';

import {
  SET_VIEW_LOADING,
  UNSET_VIEW_LOADING,
  INCREMENT_VIEW_LOADING,
  DECREMENT_VIEW_LOADING,
} from '../../constants/ActionTypes';

const pathname = '/path/name';

describe('ActionCreators: view', () => {
  describe('setLoading()', () => {
    it('should work as expected', () => {
      const expected = {
        type: SET_VIEW_LOADING,
        pathname,
      };
      expect(setLoading(pathname)).toEqual(expected);
    });
  });

  describe('unsetLoading()', () => {
    it('should work as expected', () => {
      const expected = {
        type: UNSET_VIEW_LOADING,
        pathname,
      };
      expect(unsetLoading(pathname)).toEqual(expected);
    });
  });

  describe('incrementLoading()', () => {
    it('should work as expected', () => {
      const expected = {
        type: INCREMENT_VIEW_LOADING,
        pathname,
      };
      expect(incrementLoading(pathname)).toEqual(expected);
    });
  });

  describe('decrementLoading()', () => {
    it('should work as expected', () => {
      const expected = {
        type: DECREMENT_VIEW_LOADING,
        pathname,
      };
      expect(decrementLoading(pathname)).toEqual(expected);
    });
  });
});
