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
} from './index';

describe('Favorites - selectors', () => {
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
