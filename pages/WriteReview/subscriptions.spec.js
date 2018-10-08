import { ProgressBar } from '@shopgate/pwa-ui-shared';
import { createMockStore } from '@shopgate/pwa-common/store';
import requestSubmitReview from '@shopgate/pwa-common-commerce/reviews/action-creators/requestSubmitReview';
import { ITEM_WRITE_REVIEW_PATTERN } from '@shopgate/pwa-common-commerce/product/constants';
import setViewLoading from '@shopgate/pwa-common/actions/view/setViewLoading';
import subscriber from './subscriptions';
import reducers from '../reducers';

const store = createMockStore(reducers, subscriber);

describe('WriteReview Subscriptions', () => {
  it('should subscribe to when reviews were requested', () => {
    store.dispatch(requestSubmitReview({ productId: 123 }));

    expect(ProgressBar.show).toHaveBeenCalledWith(ITEM_WRITE_REVIEW_PATTERN);
    expect(setViewLoading).toHaveBeenCalledWith(ITEM_WRITE_REVIEW_PATTERN);
  });
});
