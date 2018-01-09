/*
 *  Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 *  This source code is licensed under the Apache 2.0 license found in the
 *  LICENSE file in the root directory of this source tree.
 *
 */
import {
  mockedList,
} from '../mock';
import {
  getFavorites,
  getFavoritesCount,
  hasFavorites,
} from './index';

describe('Favorites - selectors', () => {
  describe('getFavorites', () => {
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
      state.product.productsById[mockedList.products[0].id] = product;

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
  });
});
