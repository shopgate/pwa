import { themeConfig as mockedConfig } from '@shopgate/pwa-common/helpers/config/mock';

const hash = '{"filters":{},"pipeline":"shopgate.catalog.getProductReviews","productId":"foo"}';

/**
 * Get a reviews state.
 * @param {Array} ids Fake review ids
 * @return {{reviewsByHash: {}}}
 */
const reviewsState = (ids = [1]) => ({
  reviewsByHash: {
    [hash]: {
      isFetching: false,
      expires: 999999999999,
      reviews: ids,
      totalReviewCount: ids.length,
    },
  },
});

const reviewRouteMock = {
  id: '24284d52-05b3-4da5-b035-6b23dc81b068',
  params: {
    productId: '666f6f',
  },
  pathname: '/item/666f6f/reviews',
  pattern: '/item/:productId/reviews',
  query: {},
  state: {},
};

const mockedProduct = {
  id: 'foo',
  rating: {
    average: 0,
    count: 0,
  },
};

const mockedProductWithRating = {
  id: 'foo',
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
const mockReview = id => ({
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
const mockedStateWithAll = {
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
    ...reviewsState([1, 2, 3, 4]),
  },
  ui: {
    general: {},
  },
};
/**
 * Similar to mockedStateWithAll, but contains only two reviews.
 * @type {Object}
 */
const mockedStateWithTwoReviews = (() => {
  // Must do deep clone here.
  const mockedState = JSON.parse(JSON.stringify(mockedStateWithAll));
  mockedState.reviews.reviewsByProductId.foo.reviews =
    mockedState.reviews.reviewsByProductId.foo.reviews.slice(0, 2);
  mockedState.reviews.reviewsByProductId.foo.totalReviewCount = 2;
  mockedState.reviews.reviewsByHash[hash].reviews.slice(0, 2);
  mockedState.reviews.reviewsByHash[hash].reviews.totalReviewCount = 2;

  return mockedState;
})();

/**
 * Mocked state with product only. Reviews not fetched.
 * @type {Object}
 */
const mockedStateWithoutReview = {
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
    reviewsByHash: {},
  },
  ui: {
    general: {},
  },
};
/**
 * Mocked state without data.
 * @type {{product: {currentProduct: {}, productsById: {}}}}
 */
const mockedStateProductEmpty = {
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
const setMocks = (mockReviewsAvailable = true) => {
  jest.doMock('@shopgate/pwa-common/helpers/config', () => ({
    get hasReviews() { return mockReviewsAvailable; },
    get showWriteReview() { return true},
    themeConfig: mockedConfig,
  }));
};

export {
  hash,
  mockReview,
  mockedStateProductEmpty,
  mockedStateWithoutReview,
  mockedStateWithTwoReviews,
  mockedStateWithAll,
  reviewRouteMock,
  setMocks,
};
