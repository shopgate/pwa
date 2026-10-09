import { ACTION_POP, ACTION_PUSH } from '@virtuous/conductor';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import fetchProduct from '@shopgate/pwa-common-commerce/product/actions/fetchProduct';
import { getBaseProductId, getProduct } from '@shopgate/engage/product/selectors/product';
import fetchReviews from '@shopgate/pwa-common-commerce/reviews/actions/fetchReviews';
import { REVIEW_ITEMS_PER_PAGE } from '@shopgate/pwa-common-commerce/reviews/constants';
import {
  getReviewFilterOptions,
  getReviewListFilters,
  getReviewListSort,
} from '@shopgate/pwa-common-commerce/reviews/selectors';
import { reviewsWillEnter$ } from '@shopgate/pwa-common-commerce/reviews/streams';
import subscriber from './subscriptions';

jest.mock('@shopgate/pwa-common-commerce/product/actions/fetchProduct', () => jest.fn(() => 'fetchProduct'));
jest.mock('@shopgate/pwa-common-commerce/reviews/actions/fetchReviews', () => jest.fn(() => 'fetchReviews'));
jest.mock('@shopgate/engage/product/selectors/product', () => ({
  getBaseProductId: jest.fn(),
  getProduct: jest.fn(),
}));
jest.mock('@shopgate/pwa-common-commerce/reviews/selectors', () => ({
  getReviewFilterOptions: jest.fn(),
  getReviewListFilters: jest.fn(),
  getReviewListSort: jest.fn(),
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
    getReviewListSort.mockReturnValue('rateDesc');
    getReviewListFilters.mockReturnValue({ filterMedia: true });
    getReviewFilterOptions.mockReturnValue([{
      param: 'filterRate',
      type: 'rate',
      label: 'reviews.filter_rate_all',
    }]);
  });

  it('should subscribe to the reviews route', () => {
    expect(subscribedStream).toBe(reviewsWillEnter$);
  });

  /**
   * @param {string} [historyAction] The history action that entered the route.
   * @param {Object|null} [routeState] The state of the route.
   * @returns {Object} The params of a reviews route entered with a variant id.
   */
  const createParams = (historyAction = ACTION_PUSH, routeState = undefined) => ({
    action: {
      route: {
        params: { productId: bin2hex('variant') },
        state: routeState,
      },
      historyAction,
    },
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

  it('should keep the selected sort and filter when the route is entered by going back', () => {
    reviewsWillEnterCallback(createParams(ACTION_POP));

    const listProps = {
      productId: 'variant',
      variantId: null,
    };
    expect(getReviewListSort).toHaveBeenCalledWith(state, listProps);
    expect(getReviewListFilters).toHaveBeenCalledWith(state, listProps);
    expect(fetchReviews).toHaveBeenCalledWith(
      'base',
      REVIEW_ITEMS_PER_PAGE,
      0,
      'rateDesc',
      { filterMedia: true }
    );
  });

  it('should not read the selected sort and filter on a new entry', () => {
    reviewsWillEnterCallback(createParams(ACTION_PUSH));

    expect(getReviewListSort).not.toHaveBeenCalled();
    expect(fetchReviews).toHaveBeenCalledWith('base', REVIEW_ITEMS_PER_PAGE);
  });

  it('should request the list with the star filter of the route state on a new entry', () => {
    reviewsWillEnterCallback(createParams(ACTION_PUSH, { filterRate: 4 }));

    expect(fetchReviews).toHaveBeenCalledWith(
      'base',
      REVIEW_ITEMS_PER_PAGE,
      0,
      'dateDesc',
      { filterRate: 4 }
    );
  });

  it('should ignore an invalid star filter of the route state', () => {
    reviewsWillEnterCallback(createParams(ACTION_PUSH, { filterRate: 6 }));

    expect(fetchReviews).toHaveBeenCalledWith('base', REVIEW_ITEMS_PER_PAGE);
  });

  it('should request the default list for a route without state', () => {
    reviewsWillEnterCallback(createParams(ACTION_PUSH, null));

    expect(fetchReviews).toHaveBeenCalledWith('base', REVIEW_ITEMS_PER_PAGE);
  });

  it('should ignore the star filter of the route state when the provider has no star filter', () => {
    getReviewFilterOptions.mockReturnValue([]);

    reviewsWillEnterCallback(createParams(ACTION_PUSH, { filterRate: 4 }));

    expect(fetchReviews).toHaveBeenCalledWith('base', REVIEW_ITEMS_PER_PAGE);
  });

  it('should ignore the star filter of the route state when going back', () => {
    reviewsWillEnterCallback(createParams(ACTION_POP, { filterRate: 4 }));

    expect(fetchReviews).toHaveBeenCalledWith(
      'base',
      REVIEW_ITEMS_PER_PAGE,
      0,
      'rateDesc',
      { filterMedia: true }
    );
  });
});
