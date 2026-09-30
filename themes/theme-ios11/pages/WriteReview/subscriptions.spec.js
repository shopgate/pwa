import { getCurrentRoute } from '@shopgate/pwa-common/selectors/router';
import { LoadingProvider } from '@shopgate/pwa-common/providers';
import { createMockStore } from '@shopgate/pwa-common/store';
import requestSubmitReview from '@shopgate/pwa-common-commerce/reviews/action-creators/requestSubmitReview';
import fetchUserReview from '@shopgate/pwa-common-commerce/reviews/actions/fetchUserReview';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import { writeReviewRouteWillEnter$ } from './streams';
import subscriber from './subscriptions';

const store = createMockStore(() => { }, subscriber);

jest.mock('@shopgate/engage/core', () => ({
  persistedReducers: {
    set: jest.fn(),
  },
  configuration: {
    set: jest.fn(),
  },
}));

jest.mock('@shopgate/pwa-common-commerce/reviews/actions/fetchUserReview', () => jest.fn(() => 'fetchUserReview'));

jest.mock('@shopgate/pwa-common/selectors/router', () => ({
  getCurrentRoute: jest.fn(),
}));

describe('WriteReview Subscriptions', () => {
  const pathname = '/some/path';

  beforeAll(() => {
    getCurrentRoute.mockReturnValue({
      pathname,
    });

    jest.spyOn(LoadingProvider, 'setLoading');
  });

  it('should subscribe to when reviews were requested', () => {
    store.dispatch(requestSubmitReview({ productId: 123 }));
    expect(LoadingProvider.setLoading).toHaveBeenCalledWith(pathname);
  });

  describe('own review', () => {
    const subscribe = jest.fn();
    const dispatch = jest.fn();
    let writeReviewRouteCallback;

    /**
     * @param {boolean} isLoggedIn Whether the user is logged in.
     * @returns {Object}
     */
    const createParams = isLoggedIn => ({
      action: {
        route: {
          params: {
            productId: bin2hex('foo'),
          },
        },
      },
      dispatch,
      getState: () => ({
        user: {
          login: {
            isLoggedIn,
          },
        },
      }),
    });

    beforeEach(() => {
      jest.clearAllMocks();
      subscriber(subscribe);
      [[, writeReviewRouteCallback]] = subscribe.mock.calls
        .filter(([stream]) => stream === writeReviewRouteWillEnter$);
    });

    it('should only subscribe the own review fetch to the write review route', () => {
      const ownReviewSubscriptions = subscribe.mock.calls
        .filter(([stream]) => stream === writeReviewRouteWillEnter$);
      expect(ownReviewSubscriptions).toHaveLength(1);
    });

    it('should fetch the own review for a logged in user', () => {
      writeReviewRouteCallback(createParams(true));

      expect(fetchUserReview).toHaveBeenCalledWith('foo');
      expect(dispatch).toHaveBeenCalledWith('fetchUserReview');
    });

    it('should not fetch the own review for a guest', () => {
      writeReviewRouteCallback(createParams(false));

      expect(fetchUserReview).not.toHaveBeenCalled();
      expect(dispatch).not.toHaveBeenCalled();
    });
  });
});
