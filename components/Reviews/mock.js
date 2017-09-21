/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
const mockedProduct = {
  productId: 'foo',
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
export const makeReview = id => ({
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
    currentProduct: mockedProductWithRating,
    productsById: {
      foo: {
        productData: mockedProductWithRating,
      },
    },
    reviewsByProductId: {
      foo: {
        reviews: [
          makeReview(1),
          makeReview(2),
          makeReview(3),
          makeReview(4),
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
  mockedState.product.reviewsByProductId.foo.reviews =
    mockedState.product.reviewsByProductId.foo.reviews.slice(0, 2);
  mockedState.product.reviewsByProductId.foo.totalReviewCount = 2;
  return mockedState;
})();

/**
 * Mocked state with product only. Reviews not fetched.
 * @type {Object}
 */
export const mockedStateWithProductOnly = {
  product: {
    currentProduct: mockedProduct,
    productsById: {
      foo: {
        productData: mockedProduct,
      },
    },
    reviewsByProductId: {},
  },
};

/**
 * Sets up mocks.
 * @param {bool} mockReviewsAvailable A feature flag "showReviews" value.
 * @type {Function}
 */
export const setMocks = (mockReviewsAvailable = true) => {
  jest.doMock('Config/app.json', () => ({
    features: {
      showReviews: mockReviewsAvailable,
    },
  }));
  jest.mock('Pages/Product/constants', () => ({
    REVIEW_PREVIEW_LIMIT: 2,
  }));
};

