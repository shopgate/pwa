import { getCurrentRoute, LoadingProvider } from '@shopgate/engage/core';
import { createMockStore } from '@shopgate/pwa-common/store';
import requestSubmitReview from '@shopgate/pwa-common-commerce/reviews/action-creators/requestSubmitReview';
import subscriber from './subscriptions';
import reducers from '../reducers';

const store = createMockStore(reducers, subscriber);

jest.mock('@shopgate/engage/core', () => ({
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
});
