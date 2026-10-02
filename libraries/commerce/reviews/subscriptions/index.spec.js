import { appWillStart$ } from '@shopgate/pwa-common/streams';
import fetchProductReviews from '../actions/fetchProductReviews';
import fetchProductReviewSettings from '../actions/fetchProductReviewSettings';
import { REVIEW_PREVIEW_COUNT } from '../constants';
import { reviewsDidReset$, shouldFetchReviews$ } from '../streams';
import subscriptions from './index';

jest.mock('../actions/fetchProductReviews', () => jest.fn().mockReturnValue('fetchProductReviews'));
jest.mock('../actions/fetchProductReviewSettings', () => jest.fn().mockReturnValue('fetchProductReviewSettings'));

let mockedHasReviews = true;
jest.mock('@shopgate/pwa-common/helpers/config', () => ({
  get hasReviews() { return mockedHasReviews; },
}));

describe('Reviews subscriptions', () => {
  const subscribe = jest.fn();
  const dispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockedHasReviews = true;
  });

  it('should not subscribe when reviews are disabled', () => {
    mockedHasReviews = false;
    subscriptions(subscribe);

    expect(subscribe).not.toHaveBeenCalled();
  });

  describe('reviews enabled', () => {
    let appWillStartCallback;
    let reviewsDidResetCallback;
    let shouldFetchReviewsCallback;

    beforeEach(() => {
      subscriptions(subscribe);
      [
        [, appWillStartCallback],
        [, reviewsDidResetCallback],
        [, shouldFetchReviewsCallback],
      ] = subscribe.mock.calls;
    });

    it('should subscribe to the expected streams', () => {
      expect(subscribe).toHaveBeenCalledTimes(3);
      expect(subscribe.mock.calls[0][0]).toBe(appWillStart$);
      expect(subscribe.mock.calls[1][0]).toBe(reviewsDidReset$);
      expect(subscribe.mock.calls[2][0]).toBe(shouldFetchReviews$);
    });

    it('should fetch the review settings after the reviews state was reset', () => {
      reviewsDidResetCallback({ dispatch });

      expect(fetchProductReviewSettings).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith('fetchProductReviewSettings');
    });

    it('should fetch the review settings on app start', () => {
      appWillStartCallback({ dispatch });

      expect(fetchProductReviewSettings).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith('fetchProductReviewSettings');
    });

    it('should fetch the review settings together with the preview reviews', () => {
      shouldFetchReviewsCallback({
        dispatch,
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
        action: {},
      });

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith('fetchProductReviewSettings');
      expect(fetchProductReviews).not.toHaveBeenCalled();
    });
  });
});
