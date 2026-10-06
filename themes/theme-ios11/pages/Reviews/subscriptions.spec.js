import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import fetchProduct from '@shopgate/pwa-common-commerce/product/actions/fetchProduct';
import { getBaseProductId, getProduct } from '@shopgate/pwa-common-commerce/product/selectors/product';
import fetchReviews from '@shopgate/pwa-common-commerce/reviews/actions/fetchReviews';
import { REVIEW_ITEMS_PER_PAGE } from '@shopgate/pwa-common-commerce/reviews/constants';
import { reviewsWillEnter$ } from '@shopgate/pwa-common-commerce/reviews/streams';
import subscriber from './subscriptions';

jest.mock('@shopgate/pwa-common-commerce/product/actions/fetchProduct', () => jest.fn(() => 'fetchProduct'));
jest.mock('@shopgate/pwa-common-commerce/reviews/actions/fetchReviews', () => jest.fn(() => 'fetchReviews'));
jest.mock('@shopgate/pwa-common-commerce/product/selectors/product', () => ({
  getBaseProductId: jest.fn(),
  getProduct: jest.fn(),
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
    getProduct.mockReturnValue({ id: 'variant' });
  });

  it('should subscribe to the reviews route', () => {
    expect(subscribedStream).toBe(reviewsWillEnter$);
  });

  /**
   * @returns {Object} The params of a reviews route entered with a variant id.
   */
  const createParams = () => ({
    action: { route: { params: { productId: bin2hex('variant') } } },
    dispatch,
    getState: () => state,
  });

  it('should fetch the route product and the review list of its base product', () => {
    reviewsWillEnterCallback(createParams());

    expect(getProduct).toHaveBeenCalledWith(state, { productId: 'variant' });
    expect(getBaseProductId).toHaveBeenCalledWith(state, { productId: 'variant' });
    expect(fetchProduct).toHaveBeenCalledWith('variant');
    expect(fetchReviews).toHaveBeenCalledWith('base', REVIEW_ITEMS_PER_PAGE);
    expect(dispatch).toHaveBeenCalledWith('fetchProduct');
    expect(dispatch).toHaveBeenCalledWith('fetchReviews');
  });

  it('should only fetch the product while the base product is unknown', () => {
    getProduct.mockReturnValue(null);

    reviewsWillEnterCallback(createParams());

    expect(fetchProduct).toHaveBeenCalledWith('variant');
    expect(fetchReviews).not.toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledTimes(1);
  });
});
