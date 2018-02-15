/**
* Copyright (c) 2017 - present, Shopgate, Inc. All rights reserved.
*
* This source code is licensed under the Apache 2.0 license found in the
* LICENSE file in the root directory of this source tree.
*
*/

import {
  favoritesDidChange$,
  favoritesWillRemoveItem$,
} from './index';

import {
  ERROR_ADD_FAVORITES,
  ERROR_REMOVE_FAVORITES,
  RECEIVE_ADD_FAVORITES,
  RECEIVE_REMOVE_FAVORITES,
  REQUEST_REMOVE_FAVORITES,
} from '../constants';

describe('Favorites streams', () => {
  describe('favoritesDidChange$', () => {
    const actionNames = [
      ERROR_ADD_FAVORITES,
      ERROR_REMOVE_FAVORITES,
      RECEIVE_ADD_FAVORITES,
      RECEIVE_REMOVE_FAVORITES,
    ];
    actionNames.forEach((type) => {
      it(`should return true for ${type}`, () => {
        expect(favoritesDidChange$.operator.predicate({ action: { type } })).toBe(true);
      });
    });
    it('should return for other types', () => {
      expect(favoritesDidChange$.operator.predicate({ action: { type: 'foo' } })).toBe(false);
    });
  });
  describe('favoritesWillRemoveItem$', () => {
    it(`should return true for ${REQUEST_REMOVE_FAVORITES}`, () => {
      expect(favoritesWillRemoveItem$
        .operator
        .predicate({ action: { type: REQUEST_REMOVE_FAVORITES } }))
        .toBe(true);
    });
    it('should return for other types', () => {
      expect(favoritesWillRemoveItem$.operator.predicate({ action: { type: 'foo' } })).toBe(false);
    });
  });
});
