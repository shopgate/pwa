/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export const mockedEmptyState = {
  product: {
    productsById: {
      foo: {
        productData: {
          name: 'Foo',
          availability: {
            text: 'Available',
            state: 'OK',
          },
          id: 'foo',
          baseProductId: null,
          price: {
            unitPriceStriked: 100,
            unitPriceWithTax: 101,
            currency: 'EUR',
          },
        },
      },
    },
  },
  favorites: {
    products: {
      ids: [],
      ready: true,
    },
  },
};
export const mockedState = {
  ...mockedEmptyState,
  favorites: {
    products: {
      ids: ['foo'],
      ready: true,
    },
  },
};

export const mockedNotReadyState = {
  ...mockedEmptyState,
  favorites: {
    products: {},
  },
};

