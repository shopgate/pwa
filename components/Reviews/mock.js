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
          {
            id: 1,
            author: '',
            date: '2017-09-06T12:38:51.000Z',
            rate: 100,
            title: '',
            review: 'No Name and Title Lorem ipsum dolor sit amet, con… takimata sanctus est Lorem ipsum dolor sit amet.',
          },
          {
            id: 2,
            author: 'username123',
            date: '2017-09-06T12:37:40.000Z',
            rate: 40,
            title: 'Test review 2 ',
            review: 'Lorem ipsum dolor sit amet, consetetur sadipscing … takimata sanctus est Lorem ipsum dolor sit amet.',
          },
          {
            id: 3,
            author: 'Carina Hoffmann',
            date: '2017-09-06T12:30:23.000Z',
            rate: 60,
            title: '',
            review: 'Test review',
          },
          {
            id: 4,
            author: '',
            date: '2017-09-06T12:30:23.000Z',
            rate: 20,
            title: '',
            review: '',
          },
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

