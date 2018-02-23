/**
* Copyright (c) 2017 - present, Shopgate, Inc. All rights reserved.
*
* This source code is licensed under the Apache 2.0 license found in the
* LICENSE file in the root directory of this source tree.
*
*/

import {
  favoritesError$,
  favoritesSyncIdle$,
  favoritesWillRemoveItem$,
} from './index';

import {
  ERROR_SYNC_FAVORITES,
  ERROR_FETCH_FAVORITES,
  IDLE_SYNC_FAVORITES,
  REQUEST_REMOVE_FAVORITES,
} from '../constants';

describe('Favorites streams', () => {
  describe('favoritesError$', () => {
    const actionNames = [
      ERROR_SYNC_FAVORITES,
      ERROR_FETCH_FAVORITES,
    ];
    actionNames.forEach((type) => {
      it(`should return true for ${type}`, () => {
        expect(favoritesError$.operator.predicate({ action: { type } })).toBe(true);
      });
    });
    it('should return for other types', () => {
      expect(favoritesError$.operator.predicate({ action: { type: 'foo' } })).toBe(false);
    });
  });
  describe('favoritesSyncIdle$', () => {
    it(`should return true for ${IDLE_SYNC_FAVORITES}`, () => {
      expect(favoritesSyncIdle$
        .operator
        .predicate({ action: { type: IDLE_SYNC_FAVORITES } }))
        .toBe(true);
    });
    it('should return for other types', () => {
      expect(favoritesSyncIdle$.operator.predicate({ action: { type: 'foo' } })).toBe(false);
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
