import { appWillStart$ } from '@shopgate/engage/core/streams';
import fetchProductReviews from '../actions/fetchProductReviews';
import fetchProductReviewSettings from '../actions/fetchProductReviewSettings';
import { REVIEW_PREVIEW_COUNT } from '../constants';
import { reviewsDidEnable$, reviewsDidReset$, shouldFetchReviews$ } from '../streams';
import subscriptions from './index';

jest.mock('../actions/fetchProductReviews', () => jest.fn().mockReturnValue('fetchProductReviews'));
jest.mock('../actions/fetchProductReviewSettings', () => jest.fn().mockReturnValue('fetchProductReviewSettings'));

/**
 * @param {boolean} showReviews The review setting of the merchant.
 * @returns {Function}
 */
const createGetState = showReviews => () => ({
  settings: {
    appSettings: {
      product: {
        rating: { showReviews },
      },
    },
  },
});

describe('Reviews subscriptions', () => {
  const subscribe = jest.fn();
  const dispatch = jest.fn();
  let appWillStartCallback;
  let reviewsDidResetCallback;
  let reviewsDidEnableCallback;
  let shouldFetchReviewsCallback;

  beforeEach(() => {
    jest.clearAllMocks();
    subscriptions(subscribe);
    [
      [, appWillStartCallback],
      [, reviewsDidResetCallback],
      [, reviewsDidEnableCallback],
      [, shouldFetchReviewsCallback],
    ] = subscribe.mock.calls;
  });

  it('should subscribe to the expected streams', () => {
    expect(subscribe).toHaveBeenCalledTimes(4);
    expect(subscribe.mock.calls[0][0]).toBe(appWillStart$);
    expect(subscribe.mock.calls[1][0]).toBe(reviewsDidReset$);
    expect(subscribe.mock.calls[2][0]).toBe(reviewsDidEnable$);
    expect(subscribe.mock.calls[3][0]).toBe(shouldFetchReviews$);
  });

  it('should fetch the review settings when the reviews are switched on', () => {
    reviewsDidEnableCallback({ dispatch });

    expect(fetchProductReviewSettings).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith('fetchProductReviewSettings');
  });

  describe('reviews disabled', () => {
    const getState = createGetState(false);

    it('should not fetch anything', () => {
      appWillStartCallback({
        dispatch,
        getState,
      });
      reviewsDidResetCallback({
        dispatch,
        getState,
      });
      shouldFetchReviewsCallback({
        dispatch,
        getState,
        action: { productData: { id: 'product' } },
      });

      expect(dispatch).not.toHaveBeenCalled();
    });
  });

  describe('reviews enabled', () => {
    const getState = createGetState(true);

    it('should fetch the review settings after the reviews state was reset', () => {
      reviewsDidResetCallback({
        dispatch,
        getState,
      });

      expect(fetchProductReviewSettings).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith('fetchProductReviewSettings');
    });

    it('should fetch the review settings on app start', () => {
      appWillStartCallback({
        dispatch,
        getState,
      });

      expect(fetchProductReviewSettings).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith('fetchProductReviewSettings');
    });

    it('should fetch the review settings together with the preview reviews', () => {
      shouldFetchReviewsCallback({
        dispatch,
        getState,
        action: {
          productData: {
            id: 'variant',
            baseProductId: 'base',
          },
        },
      });

      expect(dispatch).toHaveBeenCalledWith('fetchProductReviewSettings');
      expect(fetchProductReviews).toHaveBeenCalledWith('base', REVIEW_PREVIEW_COUNT);
      expect(dispatch).toHaveBeenCalledWith('fetchProductReviews');
    });

    it('should fetch the review settings when no product data is present', () => {
      shouldFetchReviewsCallback({
        dispatch,
        getState,
        action: {},
      });

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith('fetchProductReviewSettings');
      expect(fetchProductReviews).not.toHaveBeenCalled();
    });
  });
});
