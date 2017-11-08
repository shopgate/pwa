/**
 * Creates mocked review object.
 * @param {string|number} id Anything that can be an id.
 * @return {Object}
 */
export const mockReview = id => ({
  id,
  author: 'Jane Doe',
  date: '2017-09-06T12:38:51.000Z',
  rate: 100,
  title: 'Review with more than 255 characters Review with more than 255 ' +
  'charactersReview with more than 255 charactersReview with ' +
  'more than 255 charactersReview with more than 255 charactersReview with ' +
  'more than 255 charactersReview with more than 255 characters ',
  review: 'Lorem ipsum dolor sit amet, con… takimata sanctus est Lorem ipsum ' +
  'dolor sit amet.Lorem ipsum dolor sit amet, con… takimata sanctus est Lorem' +
  ' ipsum dolor sit amet.Lorem ipsum dolor sit amet, con… takimata sanctus est' +
  ' Lorem ipsum dolor sit amet.Lorem ipsum dolor sit amet, con… takimata sanctus' +
  ' est Lorem ipsum dolor sit amet.',
  productId: 'foo',
});

/**
 * Mocked state with product only. Reviews not fetched.
 * @type {Object}
 */
export const mockedStateWithoutReview = {
  product: {
    currentProduct: {
      productId: 'foo',
    },
    productsById: {
      foo: {
        productData: {
          productId: 'foo',
        },
      },
    },
  },
  reviews: {
    reviewsById: {},
    userReviewsByProductId: {},
  },
  history: {
    pathname: '/item/666f6f/write_review',
  },
  user: {
    data: {
      isFetching: false,
      firstName: 'Jane',
      lastName: 'Doe',
    },
  },
  view: {
    isLoading: false,
  },
};

export const mockedStateWithInvalidReview = {
  ...mockedStateWithoutReview,
  reviews: {
    reviewsById: {
      1: mockReview(1),
    },
    userReviewsByProductId: {
      foo: { review: 1 },
    },
  },
};

export const mockedStateWithReview = {
  ...mockedStateWithInvalidReview,
  reviews: {
    reviewsById: {
      1: {
        ...mockedStateWithInvalidReview.reviews.reviewsById[1],
        title: 'Lorem ipsum dolor sit amet',
        review: 'takimata sanctus est Lorem ipsum',
      },
    },
  },
};
