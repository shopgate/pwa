import {
  favoritesDidUpdate$,
  favoritesError$,
  favoritesSyncIdle$,
  favoritesWillRemoveItem$,
} from './index';

import {
  ERROR_FAVORITES,
  ERROR_FETCH_FAVORITES,
  RECEIVE_REMOVE_FAVORITES,
  RECEIVE_ADD_FAVORITES,
  REQUEST_ADD_FAVORITES,
  REQUEST_REMOVE_FAVORITES,
  RECEIVE_FAVORITES,
} from '../constants';

describe('Favorites streams', () => {
  describe('favoritesDidUpdate$', () => {
    const actionNames = [
      REQUEST_ADD_FAVORITES,
      REQUEST_REMOVE_FAVORITES,
      RECEIVE_FAVORITES,
      ERROR_FAVORITES,
      ERROR_FETCH_FAVORITES,
    ];

    actionNames.forEach((type) => {
      it(`should return true for ${type}`, () => {
        expect(favoritesDidUpdate$.operator.predicate({ action: { type } })).toBe(true);
      });
    });

    it('should return for other types', () => {
      expect(favoritesError$.operator.predicate({ action: { type: 'foo' } })).toBe(false);
    });
  });

  describe('favoritesError$', () => {
    const actionNames = [
      ERROR_FAVORITES,
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
    const actionName = [
      RECEIVE_ADD_FAVORITES,
      RECEIVE_REMOVE_FAVORITES,
    ];

    actionName.forEach((type) => {
      it(`should return true for ${type}`, () => {
        expect(favoritesSyncIdle$
          .operator
          .predicate({ action: { type } }))
          .toBe(true);
      });
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
