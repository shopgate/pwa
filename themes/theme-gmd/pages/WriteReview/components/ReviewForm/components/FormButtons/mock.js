import { reviewRouteMock } from '@shopgate/pwa-common-commerce/reviews/mock';
/**
 * Mocked state with product only. Reviews not fetched.
 * @type {Object}
 */
export const mockedState = {
  history: {
    pathname: '/item/666f6f/write_review',
  },
  view: {
    isLoading: false,
  },
  router: {
    routing: false,
    stack: [
      reviewRouteMock,
    ],
  },
};
