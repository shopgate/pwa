/**
* Copyright (c) 2017 - present, Shopgate, Inc. All rights reserved.
*
* This source code is licensed under the Apache 2.0 license found in the
* LICENSE file in the root directory of this source tree.
*
*/

import {
  favoritesChanged$,
  favoritesDidFetch$,
  favoritesWillFetch$,
} from './index';

import {
  ERROR_ADD_FAVORITES,
  ERROR_REMOVE_FAVORITES,
  RECEIVE_ADD_FAVORITES,
  RECEIVE_REMOVE_FAVORITES,
  RECEIVE_FAVORITES,
  REQUEST_ADD_FAVORITES,
  REQUEST_REMOVE_FAVORITES,
  REQUEST_FAVORITES,
} from '../constants';

describe('Favorites streams', () => {
  describe('favoritesChanged$', () => {
    const actionNames = [
      ERROR_ADD_FAVORITES,
      ERROR_REMOVE_FAVORITES,
      RECEIVE_ADD_FAVORITES,
      RECEIVE_REMOVE_FAVORITES,
    ];
    actionNames.forEach((type) => {
      it(`should return true for ${type}`, () => {
        expect(favoritesChanged$.operator.predicate({ action: { type } })).toBe(true);
      });
    });
    it('should return for other types', () => {
      expect(favoritesChanged$.operator.predicate({ action: { type: 'foo' } })).toBe(false);
    });
  });
  describe('favoritesDidFetch$', () => {
    it(`should return true for ${RECEIVE_FAVORITES}`, () => {
      expect(favoritesDidFetch$.operator.predicate({
        action: { type: RECEIVE_FAVORITES },
      })).toBe(true);
    });
  });
  describe('favoritesWillFetch$', () => {
    const actionNames = [
      REQUEST_ADD_FAVORITES,
      REQUEST_REMOVE_FAVORITES,
      REQUEST_FAVORITES,
    ];
    actionNames.forEach((type) => {
      it(`should return true for ${type}`, () => {
        expect(favoritesWillFetch$.operator.predicate({ action: { type } })).toBe(true);
      });
    });
    it('should return for other types', () => {
      expect(favoritesWillFetch$.operator.predicate({ action: { type: 'foo' } })).toBe(false);
    });
  });
});
