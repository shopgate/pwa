import {
  favoritesDidUpdate$,
  favoritesError$,
  favoritesSyncIdle$,
  favoritesWillRemoveItem$,
} from './index';

import {
  ERROR_SYNC_FAVORITES,
  ERROR_FETCH_FAVORITES,
  IDLE_SYNC_FAVORITES,
  REQUEST_ADD_FAVORITES,
  REQUEST_REMOVE_FAVORITES,
  RECEIVE_FAVORITES,
  RECEIVE_SYNC_FAVORITES,
} from '../constants';

describe('Favorites streams', () => {
  describe('favoritesDidUpdate$', () => {
    const actionNames = [
      REQUEST_ADD_FAVORITES,
      REQUEST_REMOVE_FAVORITES,
      RECEIVE_FAVORITES,
      RECEIVE_SYNC_FAVORITES,
      ERROR_SYNC_FAVORITES,
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
