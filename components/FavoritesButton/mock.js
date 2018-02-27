/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

const mockedProduct1 = {
  productId: 'foo',
};

const currentProduct = {
  productId: 'bar',
};

/**
 * Mocked state with product only. Favorites not set.
 * @type {Object}
 */
export const mockedStateNotOnList = {
  product: {
    currentProduct,
    productsById: {
      [mockedProduct1.productId]: {
        productData: mockedProduct1,
      },
    },
  },
  favorites: {
    products: {
      ids: [mockedProduct1.productId],
    },
  },
};

/**
 * Mocked state with product only. Favorites not set.
 * @type {Object}
 */
export const mockedStateOnList = {
  product: {
    currentProduct,
    productsById: {
      [mockedProduct1.productId]: {
        productData: mockedProduct1,
      },
      [currentProduct.productId]: {
        productData: currentProduct,
      },
    },
  },
  favorites: {
    products: {
      ids: [mockedProduct1.productId, currentProduct.productId],
    },
  },
};

/**
 * Mocked state without data.
 * @type {{product: {currentProduct: {}, favorites: {}}}}
 */
export const mockedStateEmpty = {
  product: {
    currentProduct: {},
    productsById: {},
  },
  favorites: {
    products: {
      ids: [],
    },
  },
};
