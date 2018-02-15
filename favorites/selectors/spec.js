/**
 * Copyright (c) 2017 - present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import {
  mockedList,
} from '../mock';
import {
  getFavorites,
  getFavoritesCount,
  hasFavorites,
  isInitialLoading,
  isCurrentProductOnFavoriteList,
  isFetching,
  isProductOnList,
} from './index';

describe('Favorites - selectors', () => {
  describe('getFavorites', () => {
    it('should return empty array when product is not yet available', () => {
      const result = getFavorites({
        product: {
          productsById: {},
        },
        favorites: {
          products: {
            ids: [1],
          },
        },
      });
      expect(result instanceof Array).toBe(true);
      expect(result.length).toBe(0);
    });
    it('should return empty array when product data is available but empty', () => {
      const result = getFavorites({
        product: {
          productsById: {
            foo: {
              isFetching: true,
            },
          },
        },
        favorites: {
          products: {
            ids: ['fpp'],
          },
        },
      });
      expect(result instanceof Array).toBe(true);
      expect(result.length).toBe(0);
    });
    it('should return products', () => {
      const state = {
        product: {
          productsById: {},
        },
        favorites: {
          products: {
            ids: [mockedList.products[0].id],
          },
        },
      };
      const [product] = mockedList.products;
      state.product.productsById[mockedList.products[0].id] = {
        productData: product,
      };

      const result = getFavorites(state);
      expect(result instanceof Array).toBe(true);
      /**
       * Checking basically if selector is merging product data to stored ids.
       * It's enough to check if id and name is there. All the rest should be as well.
       * Checking more fields makes no sense since in case of schema change this selector
       * won't be updated.
       */
      expect(result[0].id).toBe(mockedList.products[0].id);
      expect(result[0].name).toBe(mockedList.products[0].name);
    });
  });
  describe('getFavoritesCount', () => {
    it('should return positive number', () => {
      const result = getFavoritesCount({
        favorites: {
          products: {
            ids: [mockedList.products[0].id],
          },
        },
      });
      expect(result).toBe(1);
    });
  });
  it('should return 0', () => {
    const result = getFavoritesCount({
      favorites: {
        products: {
          ids: [],
        },
      },
    });
    expect(result).toBe(0);
  });
  describe('hasFavorites', () => {
    it('should return false', () => {
      const result = hasFavorites({
        favorites: {
          products: {
            ids: [],
          },
        },
      });
      expect(result).toBe(false);
    });
    it('should return true', () => {
      const result = hasFavorites({
        favorites: {
          products: {
            ids: [mockedList.products[0].id],
          },
        },
      });
      expect(result).toBe(true);
    });
    /**
     * `.hasFavorites` uses all state related selectors. This checks all possible type errors
     * when selector tries to reach property from unready state.
     */
    it('should not fail when state is not ready', () => {
      const result = hasFavorites({});
      expect(result).toBe(false);
    });
  });
  describe('isInitialLoading', () => {
    const notInitedState = {
      favorites: {},
    };
    const initedState = {
      favorites: {
        products: {
          ready: true,
        },
      },
    };

    it('should return true when state is not yet prepared', () => {
      expect(isInitialLoading(notInitedState)).toBe(true);
    });
    it('should return false when state is fetched for the first  time', () => {
      expect(isInitialLoading(initedState)).toBe(false);
    });
  });
  describe('isCurrentProductOnFavoriteList', () => {
    const currentProductState = {
      product: {
        currentProduct: {
          productId: 'product_1',
        },
      },
    };
    const initialState = {
      ...currentProductState,
      favorites: {},
    };
    const state = {
      ...currentProductState,
      favorites: {
        products: {
          ids: ['product_1'],
        },
      },
    };

    it('should return false when product is not listed', () => {
      expect(isCurrentProductOnFavoriteList(initialState)).toBe(false);
    });
    it('should return true when product is listed', () => {
      expect(isCurrentProductOnFavoriteList(state)).toBe(true);
    });
  });
  describe('isFetching', () => {
    const state = {
      favorites: {
        products: {
          isFetching: true,
        },
      },
    };
    it('should return true', () => {
      expect(isFetching(state)).toBe(true);
    });
    it('should return false', () => {
      state.favorites.products.isFetching = false;
      expect(isFetching(state)).toBe(false);
    });
  });
  describe('isProductOnList', () => {
    it('should return false when product is not on the list', () => {
      const state = {
        favorites: {
          products: {
            ids: [1, 2, 'foo'],
          },
        },
      };
      expect(isProductOnList(state, 0)).toBe(false);
      expect(isProductOnList(state, '1')).toBe(false);
      expect(isProductOnList(state, 'fooo')).toBe(false);
    });
    it('should return false when product is not on the list', () => {
      const state = {
        favorites: {
          products: {
            ids: [1, 2, 'foo'],
          },
        },
      };
      expect(isProductOnList(state, 1)).toBe(true);
      expect(isProductOnList(state, 2)).toBe(true);
      expect(isProductOnList(state, 'foo')).toBe(true);
    });
  });
});
