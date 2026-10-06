import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import fetchProduct from '@shopgate/pwa-common-commerce/product/actions/fetchProduct';
import { getBaseProductId } from '@shopgate/pwa-common-commerce/product/selectors/product';
import fetchReviews from '@shopgate/pwa-common-commerce/reviews/actions/fetchReviews';
import { REVIEW_ITEMS_PER_PAGE } from '@shopgate/pwa-common-commerce/reviews/constants';
import { reviewsWillEnter$ } from '@shopgate/pwa-common-commerce/reviews/streams';
import subscriber from './subscriptions';

jest.mock('@shopgate/pwa-common-commerce/product/actions/fetchProduct', () => jest.fn(() => 'fetchProduct'));
jest.mock('@shopgate/pwa-common-commerce/reviews/actions/fetchReviews', () => jest.fn(() => 'fetchReviews'));
jest.mock('@shopgate/pwa-common-commerce/product/selectors/product', () => ({
  getBaseProductId: jest.fn(),
}));

describe('Reviews subscriptions', () => {
  const subscribe = jest.fn();
  const dispatch = jest.fn();
  const state = {};
  let subscribedStream;
  let reviewsWillEnterCallback;

  beforeAll(() => {
    subscriber(subscribe);
    [[subscribedStream, reviewsWillEnterCallback]] = subscribe.mock.calls;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    getBaseProductId.mockReturnValue('base');
  });

  it('should subscribe to the reviews route', () => {
    expect(subscribedStream).toBe(reviewsWillEnter$);
  });

  it('should fetch the route product and the review list of its base product', () => {
    reviewsWillEnterCallback({
      action: { route: { params: { productId: bin2hex('variant') } } },
      dispatch,
      getState: () => state,
    });

    expect(getBaseProductId).toHaveBeenCalledWith(state, {
      productId: 'variant',
      variantId: null,
    });
    expect(fetchProduct).toHaveBeenCalledWith('variant');
    expect(fetchReviews).toHaveBeenCalledWith('base', REVIEW_ITEMS_PER_PAGE);
    expect(dispatch).toHaveBeenCalledWith('fetchProduct');
    expect(dispatch).toHaveBeenCalledWith('fetchReviews');
  });
});
