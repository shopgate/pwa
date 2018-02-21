/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

export const mockedStoreWithShippingPrice = {
  product: {
    currentProduct: {
      productId: 'fakeId',
    },
    shippingByProductId: {
      fakeId: {
        shipping: {
          price: 1,
          currency: 'EUR',
        },
      },
    },
  },
};
export const mockedStoreWithFreeShipping = {
  product: {
    ...mockedStoreWithShippingPrice.product,
    shippingByProductId: {
      fakeId: {
        shipping: {
          price: 0,
          currency: 'EUR',
        },
      },
    },
  },
};

export const mockedStoreWithUnknownShipping = {
  product: {
    ...mockedStoreWithShippingPrice.product,
    shippingByProductId: {
      fakeId: {
        shipping: {
          price: null,
          currency: 'EUR',
        },
      },
    },
  },
};
