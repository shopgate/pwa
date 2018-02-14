/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

const mockedProduct = {
  productId: 'foo',
  rating: {
    average: 0,
    count: 0,
  },
};

const mockedProductWithRating = {
  productId: 'foo',
  rating: {
    average: 50,
    count: 4,
  },
};

/**
 * Creates mocked review object.
 * @param {string|number} id Anything that can be an id.
 * @return {Object}
 */
export const mockReview = id => ({
  id,
  author: '',
  date: '2017-09-06T12:38:51.000Z',
  rate: 100,
  title: '',
  review: 'No Name and Title Lorem ipsum dolor sit amet, con… takimata sanctus est Lorem ipsum dolor sit amet.',
});

/**
 * Mocked state with 4 reviews.
 * @type {Object}
 */
export const mockedStateWithAll = {
  product: {
    currentProduct: mockedProduct,
    productsById: {
      foo: {
        productData: mockedProductWithRating,
      },
    },
  },
  reviews: {
    reviewsById: {
      1: mockReview(1),
      2: mockReview(2),
      3: mockReview(3),
      4: mockReview(4),
    },
    reviewsByProductId: {
      foo: {
        reviews: [
          1,
          2,
          3,
          4,
        ],
        totalReviewCount: 4,
      },
    },
  },
};
/**
 * Similar to mockedStateWithAll, but contains only two reviews.
 * @type {Object}
 */
export const mockedStateWithTwoReviews = (() => {
  // Must do deep clone here.
  const mockedState = JSON.parse(JSON.stringify(mockedStateWithAll));
  mockedState.reviews.reviewsByProductId.foo.reviews =
    mockedState.reviews.reviewsByProductId.foo.reviews.slice(0, 2);
  mockedState.reviews.reviewsByProductId.foo.totalReviewCount = 2;
  return mockedState;
})();

/**
 * Mocked state with product only. Reviews not fetched.
 * @type {Object}
 */
export const mockedStateWithoutReview = {
  product: {
    currentProduct: mockedProduct,
    productsById: {
      foo: {
        productData: mockedProduct,
      },
    },
  },
  reviews: {
    reviewsById: {},
    reviewsByProductId: {},
  },
};
/**
 * Mocked state without data.
 * @type {{product: {currentProduct: {}, productsById: {}}}}
 */
export const mockedStateProductEmpty = {
  product: {
    currentProduct: {},
    productsById: {},
  },
};

/**
 * Sets up mocks.
 * @param {bool} mockReviewsAvailable A feature flag "hasReviews" value.
 * @type {Function}
 */
export const setMocks = (mockReviewsAvailable = true) => {
  jest.doMock('@shopgate/pwa-common/helpers/config', () => ({
    hasReviews: mockReviewsAvailable,
  }));
};

