/* eslint-disable extra-rules/no-single-line-objects */
import { combineReducers } from 'redux';
import { createMockStore } from '@shopgate/pwa-common/store';
import { bin2hex as mockBin2Hex } from '@shopgate/pwa-common/helpers/data';
import { routeWillEnter } from '@shopgate/pwa-common/action-creators/router';
import { HISTORY_PUSH_ACTION, HISTORY_REPLACE_ACTION } from '@shopgate/pwa-common/constants/ActionTypes';
import product from '@shopgate/pwa-common-commerce/product/reducers';
import receiveProduct from '@shopgate/pwa-common-commerce/product/action-creators/receiveProduct';
import { ITEM_PATTERN, ITEM_REVIEWS_PATTERN } from '../constants';
import {
  productReceived$,
  variantWillUpdate$,
  variantDidChange$,
} from './index';

let mockedRoutePattern;
let mockedRouteProductId;

jest.mock('@shopgate/pwa-common/helpers/router', () => ({
  getCurrentRoute: () => ({
    pattern: mockedRoutePattern,
    params: {
      productId: mockBin2Hex(mockedRouteProductId),
    },
  }),
}));

/**
 * Wrapper for the routeWillEnter action. It also sets up the mocked current route.
 * @param {string} pattern A route pattern.
 * @param {string} historyAction A history action.
 * @param {string} productId A product id.
 * @return {Object}
 */
const wrappedRouteWillEnter = (pattern, historyAction, productId = '') => {
  mockedRoutePattern = pattern;
  mockedRouteProductId = productId;

  return routeWillEnter({
    pattern,
  }, historyAction);
};

describe('Product streams', () => {
  let store;
  let dispatch;

  beforeEach(() => {
    store = createMockStore(combineReducers({ product }));
    ({ dispatch } = store);
    mockedRoutePattern = ITEM_PATTERN;
    mockedRouteProductId = '';
  });

  describe('productReceived$', () => {
    let productReceivedSubscriber;

    beforeEach(() => {
      productReceivedSubscriber = jest.fn();
      productReceived$.subscribe(productReceivedSubscriber);
    });

    it('should emit when a product was received', () => {
      dispatch(receiveProduct());
      expect(productReceivedSubscriber).toHaveBeenCalledTimes(1);
    });

    it('should not emit for other actions', () => {
      dispatch({ type: 'someaction' });
      expect(productReceivedSubscriber).not.toHaveBeenCalled();
    });
  });

  describe('variantWillUpdate$', () => {
    let variantWillUpdateSubscriber;

    beforeEach(() => {
      variantWillUpdateSubscriber = jest.fn();
      variantWillUpdate$.subscribe(variantWillUpdateSubscriber);
    });

    it('should emit when an item page was replaced', () => {
      dispatch(wrappedRouteWillEnter(ITEM_PATTERN, HISTORY_REPLACE_ACTION));
      expect(variantWillUpdateSubscriber).toHaveBeenCalledTimes(1);
    });

    it('should not emit when an item page was pushed', () => {
      dispatch(wrappedRouteWillEnter(ITEM_PATTERN, HISTORY_PUSH_ACTION));
      expect(variantWillUpdateSubscriber).not.toHaveBeenCalled();
    });

    it('should not emit when an page was replaced which is not the item page', () => {
      dispatch(wrappedRouteWillEnter(ITEM_REVIEWS_PATTERN, HISTORY_REPLACE_ACTION));
      expect(variantWillUpdateSubscriber).not.toHaveBeenCalled();
    });
  });

  describe('variantDidChange$', () => {
    const baseProductId = 'baseProductId';
    const productId = 'productId';

    let variantDidChangeSubscriber;

    beforeEach(() => {
      variantDidChangeSubscriber = jest.fn();
      variantDidChange$.subscribe(variantDidChangeSubscriber);
    });

    it('should emit when a variant was selected and base product data is available', () => {
      dispatch(receiveProduct(baseProductId, { id: baseProductId }));

      dispatch(wrappedRouteWillEnter(ITEM_PATTERN, HISTORY_REPLACE_ACTION, productId));
      dispatch(receiveProduct(productId, { id: productId, baseProductId }));

      expect(variantDidChangeSubscriber).toHaveBeenCalledTimes(1);
    });

    it('should not emit until base product data is available', () => {
      dispatch(wrappedRouteWillEnter(ITEM_PATTERN, HISTORY_REPLACE_ACTION, productId));
      dispatch(receiveProduct(productId, { id: productId, baseProductId }));
      expect(variantDidChangeSubscriber).not.toHaveBeenCalled();

      dispatch(receiveProduct(baseProductId, { id: baseProductId }));
      expect(variantDidChangeSubscriber).toHaveBeenCalledTimes(1);
    });

    it('should only emit when the underlying streams emit in the correct order', () => {
      dispatch(receiveProduct(baseProductId, { id: baseProductId }));

      dispatch(wrappedRouteWillEnter(ITEM_PATTERN, HISTORY_REPLACE_ACTION, productId));
      dispatch(receiveProduct(productId, { id: productId, baseProductId }));
      expect(variantDidChangeSubscriber).toHaveBeenCalledTimes(1);

      dispatch(receiveProduct(productId, { id: productId, baseProductId }));
      dispatch(wrappedRouteWillEnter(ITEM_PATTERN, HISTORY_REPLACE_ACTION, productId));
      expect(variantDidChangeSubscriber).toHaveBeenCalledTimes(1);

      dispatch(receiveProduct(productId, { id: productId, baseProductId }));
      expect(variantDidChangeSubscriber).toHaveBeenCalledTimes(2);
    });
  });
});

/* eslint-enable extra-rules/no-single-line-objects */
