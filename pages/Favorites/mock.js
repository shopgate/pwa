/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export const mockedEmptyState = {
  product: {
    productsById: {},
  },
  favorites: {
    products: {
      ids: [],
    },
  },
};
export const mockedState = {
  ...mockedEmptyState,
  favorites: {
    products: {
      ids: [{}],
    },
  },
};
