import { themeConfig as mockedConfig } from '@shopgate/pwa-common/helpers/config/mock';

/**
 * Mock for getElementById
 * @param {function} scrollSpy Element.scroll spy function.
 * @returns {function}
 */
export const getElementById = scrollSpy => () => ({
  offsetTop: 100,
  closest() {
    return {
      scroll: scrollSpy,
    };
  },
});

/**
 * Sets up mocks.
 * @param {bool} mockReviewsAvailable A feature flag "hasReviews" value.
 * @type {Function}
 */
export const setMocks = (mockReviewsAvailable = true) => {
  jest.doMock('@shopgate/pwa-common/helpers/config', () => ({
    get hasReviews() { return mockReviewsAvailable; },
    get showWriteReview() { return true; },
    themeConfig: mockedConfig,
  }));
};

