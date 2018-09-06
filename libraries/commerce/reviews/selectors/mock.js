import { SHOPGATE_CATALOG_GET_PRODUCT_REVIEWS } from '../constants/Pipelines';

export const existingHash
  = `{"filters":{},"pipeline":"${SHOPGATE_CATALOG_GET_PRODUCT_REVIEWS}","productId":"9209597131"}`;

export const testReviews = [
  {
    author: 'John Canada',
    date: '2017-09-12T15:17:47.000Z',
    rate: 60,
    title: 'title 1',
    review: 'review 2',
    id: 1,
  },
  {
    author: 'Oleks Bilenko',
    date: '2017-09-12T15:13:03.000Z',
    rate: 80,
    title: 'Title',
    review: 'Review',
    id: 2,
  },
  {
    author: '',
    date: '2017-09-06T12:38:51.000Z',
    rate: 100,
    title: '',
    review: 'No Name and Title\r\nLorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
    id: 3,
  },
  {
    author: 'ca ship ship',
    date: '2017-09-06T12:37:40.000Z',
    rate: 40,
    title: 'Test review 2 ',
    review: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
    id: 4,
  },
  {
    author: 'Carina Hoffmann',
    date: '2017-09-06T12:30:23.000Z',
    rate: 60,
    title: '',
    review: 'Test review',
    id: 5,
  },
];
export const emptyState = {
  reviews: {
    reviewsByHash: {},
    reviewsById: {},
    reviewsByProductId: {},
    userReviewsByProductId: {},
  },
  user: {
    login: {
      isLoggedIn: false,
    },
    data: {},
  },
};

export const finalState = {
  product: {
    productsById: {
      9209597131: {
        productData: {
          id: '9209597131',
        },
      },
    },
  },
  reviews: {
    reviewsByProductId: {
      9209597131: {
        isFetching: false,
        totalReviewCount: 5,
        reviews: [1, 2, 3, 4, 5],
      },
    },
    reviewsById: testReviews.reduce((currentReviews, review) => ({
      ...currentReviews,
      [review.id]: review,
    }), {}),
    reviewsByHash: {
      [`{"filters":{},"pipeline":"${SHOPGATE_CATALOG_GET_PRODUCT_REVIEWS}","productId":"9209597131"}`]: {
        isFetching: false,
        expires: 0,
        reviews: [1, 2, 3, 4, 5],
        totalReviewCount: 10,
      },
    },
    userReviewsByProductId: {
      9209597131: {
        isFetching: false,
        review: testReviews[0].id,
      },
    },
  },
  user: {
    login: {
      isLoggedIn: true,
    },
    data: {
      firstName: 'Foo',
      lastName: 'Bar',
    },
  },
};
