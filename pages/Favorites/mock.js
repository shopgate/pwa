/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
const foo = {
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
};

const bar = {
  productData: {
    name: 'Bar',
    availability: {
      text: 'Available',
      state: 'OK',
    },
    id: 'bar',
    baseProductId: null,
    price: {
      unitPriceStriked: 100,
      unitPriceWithTax: 101,
      currency: 'EUR',
    },
  },
};

export const mockedEmptyState = {
  product: {
    productsById: {
      foo,
    },
  },
  favorites: {
    products: {
      ids: [],
      ready: true,
      isFetching: false,
    },
  },
};

export const mockedState = {
  ...mockedEmptyState,
  favorites: {
    products: {
      ids: ['foo'],
      ready: true,
      isFetching: false,
    },
  },
};

export const mockedNotReadyState = {
  ...mockedEmptyState,
  favorites: {
    products: {},
    isFetching: false,
  },
};

export const mockedNextProps = {
  products: [
    foo.productData,
    bar.productData,
  ],
};

